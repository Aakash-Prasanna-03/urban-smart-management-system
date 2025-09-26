export default function IssueCard({ issue, user, onUpvote, disabledUpvote }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{issue.title}</h2>
      <p className="text-gray-600 dark:text-gray-300 mt-2">{issue.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={onUpvote}
          disabled={disabledUpvote}
          className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
            disabledUpvote
              ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          Upvote ({issue.upvotes || 0})
        </button>
      </div>
    </div>
  );
}
