import axios from "axios";
const client = axios.create({ baseURL: "/api/admin" });

export const fetchAllIssues = async () => {
  const res = await client.get(`/issues`);
  return res.data;
};

export const deleteIssue = async (id) => {
  await client.delete(`/issues/${id}`);
};

export const updateIssueStatus = async (id, status) => {
  await client.put(`/issues/${id}`, { status });
};
