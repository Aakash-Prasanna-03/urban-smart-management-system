import Issue from '../models/Issue.js';
import haversine from 'haversine-distance';
import fetch from 'node-fetch';

// Helper: Call Gemini API for risk analysis
async function analyzeRiskWithGemini(description, apiKey) {
	const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
	const prompt = `You are an expert in urban infrastructure. Analyze the following issue descriptions and categorize the risk level as low, moderate, or urgent. Only real urban infrastructure, sanitation, traffic, environment, or public-safety issues should be moderate or urgent. All unrelated, spam, or non-urban issues must be classified as low. Respond ONLY with the risk level.\nDescriptions: ${description}`;
	const body = {
		contents: [{ parts: [{ text: prompt }] }]
	};
	try {
		const res = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});
		const data = await res.json();
		// Gemini returns text in data.candidates[0].content.parts[0].text
		return data?.candidates?.[0]?.content?.parts?.[0]?.text?.toLowerCase() || 'moderate';
	} catch (err) {
		return 'moderate'; // fallback
	}
}

// Main: Group issues and assign risk level
export const getGroupedIssuesWithRisk = async (req, res) => {
	try {
		const issues = await Issue.find().sort({ createdAt: -1 }).select('-__v');
		const RADIUS_METERS = 100;
		const grouped = [];
		const visited = new Set();
		for (let i = 0; i < issues.length; i++) {
			if (visited.has(issues[i]._id.toString())) continue;
			const group = [issues[i]];
			visited.add(issues[i]._id.toString());
			for (let j = i + 1; j < issues.length; j++) {
				if (visited.has(issues[j]._id.toString())) continue;
				const dist = haversine(
					{ lat: issues[i].location.lat, lng: issues[i].location.lng },
					{ lat: issues[j].location.lat, lng: issues[j].location.lng }
				);
				if (dist <= RADIUS_METERS && issues[i].category === issues[j].category) {
					group.push(issues[j]);
					visited.add(issues[j]._id.toString());
				}
			}
			grouped.push(group);
		}
		// Get API key from env
		const apiKey = process.env.GEMINI_API_KEY;
		// Format and analyze risk for each group
			const formatted = await Promise.all(grouped.map(async group => {
				// Most common title
				const titleCounts = {};
				group.forEach(issue => {
					const t = issue.title.trim().toLowerCase();
					titleCounts[t] = (titleCounts[t] || 0) + 1;
				});
				const mostCommonTitle = Object.entries(titleCounts).sort((a, b) => b[1] - a[1])[0][0];
				// Most common category
				const categoryCounts = {};
				group.forEach(issue => {
					const c = issue.category;
					categoryCounts[c] = (categoryCounts[c] || 0) + 1;
				});
				let mostCommonCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0];
				// Auto-classify category if 'other' or missing
				if (!mostCommonCategory || mostCommonCategory === 'other') {
					const descText = group.map(issue => `${issue.title} ${issue.description}`).join(' ');
					const categoryKeywords = {
						'infrastructure': ['road', 'bridge', 'utility', 'construction'],
						'sanitation': ['waste', 'garbage', 'clean', 'sanitation', 'trash'],
						'traffic': ['traffic', 'signal', 'congestion', 'sign', 'bus', 'transport'],
						'public-safety': ['safety', 'security', 'street light', 'crime', 'danger'],
						'environment': ['pollution', 'park', 'tree', 'green', 'air', 'water'],
						'utilities': ['electricity', 'water', 'gas', 'power', 'outage'],
					};
					let detectedCategory = 'other';
					for (const [cat, keywords] of Object.entries(categoryKeywords)) {
						if (keywords.some(k => descText.toLowerCase().includes(k))) {
							detectedCategory = cat;
							break;
						}
					}
					// If still 'other', ask Gemini for category
					if (detectedCategory === 'other' && apiKey) {
						const prompt = `Given the following urban issue description, classify it into one of these categories: infrastructure, sanitation, traffic, public-safety, environment, utilities, other, unrelated. Respond ONLY with the category.\nDescription: ${descText}`;
						try {
							const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
								{
									method: 'POST',
									headers: { 'Content-Type': 'application/json' },
									body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
								});
							const data = await res.json();
							const geminiCat = data?.candidates?.[0]?.content?.parts?.[0]?.text?.toLowerCase().trim();
							if (['infrastructure','sanitation','traffic','public-safety','environment','utilities','other','unrelated'].includes(geminiCat)) {
								detectedCategory = geminiCat;
							}
						} catch (err) {}
					}
					mostCommonCategory = detectedCategory;
				}
				// Keyword filter for urban issues
				const urbanKeywords = [
					'road', 'street', 'light', 'pothole', 'sanitation', 'traffic', 'environment', 'public', 'safety', 'water', 'drain', 'garbage', 'infrastructure', 'park', 'signal', 'bus', 'transport', 'electricity', 'sewage', 'construction', 'bridge', 'crosswalk', 'sidewalk', 'pollution', 'waste', 'clean', 'repair', 'accident', 'danger', 'flood', 'fire', 'ambulance', 'hospital', 'school', 'power', 'outage', 'tree', 'fallen', 'block', 'hazard', 'maintenance'
				];
				const isUrban = urbanKeywords.some(keyword => mostCommonTitle.includes(keyword));
				// Emergency keyword detection
				const emergencyKeywords = ['urgent', 'emergency', 'danger', 'accident', 'critical', 'immediate', 'life-threatening', 'fire', 'flood', 'ambulance', 'hospital'];
				const isEmergency = emergencyKeywords.some(keyword => group.map(issue => issue.description.toLowerCase()).join(' ').includes(keyword));
				let allUpvotes = [...new Set(group.flatMap(issue => issue.upvotes))];
				const reporterIds = [...new Set(group.map(issue => issue.userId))];
				allUpvotes = [...new Set([...allUpvotes, ...reporterIds])];
				const upvoteCount = allUpvotes.length;
				// Send each description as a separate line for clarity
				const descriptions = group.map(issue => `- ${issue.description}`).join('\n');
				// Date factor: recent issues are more urgent
				const daysSinceFirst = (Date.now() - new Date(group[0].createdAt)) / (1000 * 60 * 60 * 24);
				// Gemini risk analysis
				let geminiRisk = 'low';
				if (apiKey) {
					geminiRisk = await analyzeRiskWithGemini(descriptions, apiKey);
					console.log(`Gemini risk for group [${mostCommonTitle}]:`, geminiRisk);
				}
				// Stricter risk classification
				let riskLevel = 'low';
				if (!isUrban) {
					mostCommonCategory = 'unrelated';
					riskLevel = 'low';
				} else if ((geminiRisk === 'urgent' || isEmergency) && (upvoteCount >= 3 || daysSinceFirst < 3)) {
					riskLevel = 'urgent';
				} else if ((geminiRisk === 'moderate' && upvoteCount >= 2) || (isEmergency && upvoteCount >= 1)) {
					riskLevel = 'moderate';
				} else if (geminiRisk === 'low' && isUrban) {
					riskLevel = 'low';
				} else {
					riskLevel = 'low';
				}
				return {
					_id: group[0]._id,
					title: mostCommonTitle.charAt(0).toUpperCase() + mostCommonTitle.slice(1),
					description: descriptions,
					category: mostCommonCategory,
					location: group[0].location,
					image: group[0].image,
					upvotes: allUpvotes,
					upvoteCount,
					createdAt: group[0].createdAt,
					riskLevel
				};
			}));
		// Optional: filter by riskLevel if query param provided
		const { risk } = req.query;
		let filtered = formatted;
		if (risk) {
			filtered = formatted.filter(g => g.riskLevel === risk && g.category !== 'unrelated');
		}
		res.json({ success: true, count: filtered.length, data: filtered });
	} catch (error) {
		res.status(500).json({ success: false, message: 'Server Error: Failed to fetch grouped issues with risk', error: error.message });
	}
};
