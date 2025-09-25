// src/api/issues.js
import axios from "axios";

const client = axios.create({ baseURL: "/api" });

export const fetchRecentIssues = async () => {
  const res = await client.get(`/issues`);
  return res.data;
};

export const fetchUserIssues = async (userId) => {
  const res = await client.get(`/issues/user/${userId}`);
  return res.data;
};

export const addIssue = async (issueData) => {
  console.log('addIssue called with:', issueData);
  console.log('Is FormData?', issueData instanceof FormData);
  
  // Use fetch instead of axios to ensure FormData is sent correctly
  const response = await fetch('/api/issues', {
    method: 'POST',
    body: issueData, // Don't set Content-Type, let browser set it with boundary
  });
  
  console.log('Response status:', response.status);
  console.log('Response headers:', response.headers);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.log('Error response:', errorText);
    try {
      const errorData = JSON.parse(errorText);
      throw new Error(errorData.message || `HTTP ${response.status}`);
    } catch {
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
  }
  
  return await response.json();
};

export const upvoteIssue = async (id, userId) => {
  const res = await client.put(`/admin/issues/${id}/upvote`, { userId });
  return res.data;
};

export const deleteIssue = async (issueId) => {
  try {
    const res = await client.delete(`/issues/${issueId}`);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

