import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function fetchAdminUsers(params: Record<string, any>) {
  const url = `${API_BASE_URL}/admin/users`
  const res = await axios.get(url, {headers: {
    Authorization: `token`
  }});
  return res.data;
}
