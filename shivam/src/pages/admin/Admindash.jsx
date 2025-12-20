import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logos.png"





const AdminDashboard = () => {
  const [active, setActive] = useState("add");

  const [dematName, setDematName] = useState("");
  const [demats, setDemats] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackUsers, setFeedbackUsers] = useState([]);


  /* ======================
     API INSTANCE
  ======================= */
  const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/admin`,
    withCredentials: true,
  });

  /* ======================
     DEMAT
  ======================= */
  const fetchDemats = async () => {
    try {
      const res = await api.get("/demats");
      setDemats(res.data.demats || []);
    } catch {
      toast.error("Failed to load demats");
    }
  };
  const fetchFeedbackUsers = async () => {
  try {
    const res = await api.get("/feedback/users");
    setFeedbackUsers(res.data.users || []);
  } catch {
    toast.error("Failed to load feedback users");
  }
};

  const addDematHandler = async () => {
    if (!dematName.trim()) {
      toast.error("Demat name required");
      return;
    }

    try {
      await api.post("/demat", { name: dematName });
      toast.success("Demat added successfully");
      setDematName("");
      fetchDemats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding demat");
    }
  };

  const deleteDemat = async (id) => {
    if (!window.confirm("Delete this demat permanently?")) return;

    try {
      await api.delete(`/demat/${id}`);
      toast.success("Demat deleted");
      fetchDemats();
    } catch {
      toast.error("Failed to delete demat");
    }
  };

  /* ======================
     USERS
  ======================= */
  const fetchPendingUsers = async () => {
    const res = await api.get("/users/pending");
    setPendingUsers(res.data.users || []);
  };

  const fetchVerifiedUsers = async () => {
    const res = await api.get("/users/verified");
    setVerifiedUsers(res.data.users || []);
  };

  const verifyUser = async (id) => {
    try {
      await api.patch(`/users/verify/${id}`);
      toast.success("User verified");
      fetchPendingUsers();
    } catch {
      toast.error("Failed to verify user");
    }
  };

  /* ======================
     FEEDBACK
  ======================= */
  const fetchFeedbacks = async () => {
    const res = await api.get("/feedbacks");
    setFeedbacks(res.data.feedbacks || []);
  };

  /* ======================
     LOGOUT
  ======================= */
  const logoutHandler = async () => {
    try {
      await api.post("/logout");
      localStorage.clear();
      window.location.href = "/login";
    } catch {
      toast.error("Logout failed");
    }
  };

  /* ======================
     EFFECTS
  ======================= */
  useEffect(() => {
    if (active === "view") fetchDemats();
    if (active === "pending") fetchPendingUsers();
    if (active === "verified") fetchVerifiedUsers();
    if (active === "feedback")  fetchFeedbackUsers();
  }, [active]);

  /* ======================
     UI
  ======================= */
  const navigate = useNavigate();
  return (
    <Wrapper>
      <Glow />
      <Layout>
        {/* SIDEBAR */}
        <Sidebar>
     <Logo>
  <img
    src={logo}
    alt="Dial Flow"
    style={{
      width: "200px",
      height: "100px",
      filter: "drop-shadow(0 6px 18px rgba(99,102,241,0.55))",
    }}
  />
</Logo>


          <NavBtn type="button" active={active === "add"} onClick={() => setActive("add")}>
            ➕ Add Demat
          </NavBtn>

          <NavBtn type="button" active={active === "view"} onClick={() => setActive("view")}>
            📋 View Demats
          </NavBtn>

          <NavBtn type="button" active={active === "pending"} onClick={() => setActive("pending")}>
            ⏳ Pending Users
          </NavBtn>

          <NavBtn type="button" active={active === "verified"} onClick={() => setActive("verified")}>
            ✅ Verified Users
          </NavBtn>

          <NavBtn type="button" active={active === "feedback"} onClick={() => setActive("feedback")}>
            💬 Feedback
          </NavBtn>

          <LogoutBtn type="button" onClick={logoutHandler}>
            🚪 Logout
          </LogoutBtn>
        </Sidebar>

        {/* CONTENT */}
        <Content>
          {/* ADD DEMAT */}
          {active === "add" && (
            <Card>
              <CardTitle>Add New Demat</CardTitle>
              <Input
                value={dematName}
                onChange={(e) => setDematName(e.target.value)}
                placeholder="Enter Demat Name"
              />
              <PrimaryButton type="button" onClick={addDematHandler}>
                Add Demat
              </PrimaryButton>
            </Card>
          )}

          {/* VIEW DEMATS */}
          {active === "view" && (
            <Card>
              <CardTitle>Demat Platforms</CardTitle>
              <TableWrapper>
                <Table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demats.map((d) => (
                      <tr key={d._id}>
                        <td>{d.name}</td>
                        <td>
                          <DeleteBtn
                            type="button"
                            onClick={() => deleteDemat(d._id)}
                          >
                            Delete
                          </DeleteBtn>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableWrapper>
            </Card>
          )}

          {/* PENDING USERS */}
          {active === "pending" && (
            <Card>
              <CardTitle>Pending Users</CardTitle>
              {pendingUsers.map((u) => (
                <UserRow key={u._id}>
                  <span>{u.fullName} ({u.email})</span>
                  <VerifyBtn type="button" onClick={() => verifyUser(u._id)}>
  Verify
</VerifyBtn>

                </UserRow>
              ))}
            </Card>
          )}

          {/* VERIFIED USERS */}
          {active === "verified" && (
            <Card>
              <CardTitle>Verified Users</CardTitle>
              {verifiedUsers.map((u) => (
                <UserRow key={u._id}>
                  {u.fullName} ({u.email})
                </UserRow>
              ))}
            </Card>
          )}

          {/* FEEDBACK */}
          {/* FEEDBACK USERS */}
{active === "feedback" && (
  <Card>
    <CardTitle>User Feedback Reports</CardTitle>

    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Total Feedback</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {feedbackUsers.map((u) => (
            <tr key={u._id}>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td>{u.mobile}</td>
              <td>{u.total}</td>
              <td>
                <ViewBtn
  type="button"
  onClick={() => navigate(`/admin/feedback/${u._id}`)}
>
  View
</ViewBtn>


              <DownloadBtn
  type="button"
  onClick={() =>
    window.open(
      `${import.meta.env.VITE_API_URL}/api/admin/feedback/download/${u._id}`,
      "_blank"
    )
  }
>
  Download
</DownloadBtn>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  </Card>
)}

        </Content>
      </Layout>
    </Wrapper>
  );
};

export default AdminDashboard;




/* ===================== STYLES ===================== */
/* ===================== ADVANCED FAANG STYLE ===================== */
/* ================= LAYOUT ================= */
/* ===================== GOVT / PSU GRADE UI ===================== */

import styled from "styled-components";

/* ===================== ENTERPRISE / FAANG UI ===================== */

const Wrapper = styled.div`
  min-height: 100vh;
  background: #0b1220;
`;

/* ---------- Layout Animation ---------- */
const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  animation: pageFade 0.45s ease-out;

  @keyframes pageFade {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Sidebar = styled.div`
  width: 260px;
  background: #0b1220;
  border-right: 1px solid #1f2937;
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  padding: 2.8rem;
  background: #0b1220;
  animation: contentFade 0.5s ease-out;

  @keyframes contentFade {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

/* ---------- Navigation ---------- */
const NavBtn = styled.button`
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid #1f2937;
  background: ${({ active }) => (active ? "#111827" : "#0b1220")};
  color: #e5e7eb;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: all 0.25s ease;

  &:hover {
    background: #111827;
    transform: translateX(3px);
  }
`;

const LogoutBtn = styled.button`
  margin-top: auto;
  width: 100%;
  padding: 12px;
  background: #3f1d1d;
  border: 1px solid #7f1d1d;
  border-radius: 8px;
  color: #fee2e2;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: #7f1d1d;
    transform: translateY(-1px);
  }
`;

/* ---------- Card ---------- */
const Card = styled.div`
  max-width: 900px;
  background: #0f172a;
  border-radius: 12px;
  border: 1px solid #1f2937;
  padding: 2.4rem;
  animation: cardEnter 0.45s ease-out;

  @keyframes cardEnter {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CardTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 1.6rem;
`;

/* ---------- Inputs ---------- */
const Input = styled.input`
  width: 100%;
  padding: 12px;
  background: #020617;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #e5e7eb;
  margin-bottom: 14px;
  transition: border 0.2s ease;

  &:focus {
    outline: none;
    border-color: #64748b;
  }
`;

/* ---------- Buttons ---------- */
const PrimaryButton = styled.button`
  width: 100%;
  background: #1e293b;
  padding: 12px;
  border: 1px solid #334155;
  border-radius: 8px;
  font-weight: 700;
  color: #f1f5f9;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: #334155;
    transform: translateY(-1px);
  }
`;

const VerifyBtn = styled.button`
  padding: 7px 14px;
  background: #14532d;
  border: 1px solid #166534;
  border-radius: 8px;
  color: #dcfce7;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: #166534;
    transform: translateY(-1px);
  }
`;

const DeleteBtn = styled.button`
  background: #3f1d1d;
  border: 1px solid #7f1d1d;
  padding: 6px 12px;
  border-radius: 8px;
  color: #fee2e2;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.25s ease;

  &:hover {
    background: #7f1d1d;
  }
`;

/* ---------- Rows / Tables ---------- */
const UserRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  background: #0f172a;
  border-radius: 10px;
  border: 1px solid #1f2937;
  color: #e5e7eb;
  animation: rowFade 0.35s ease-out;

  @keyframes rowFade {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    background: #111827;
  }
`;

const TableWrapper = styled.div`
  max-height: 380px;
  overflow-y: auto;
  border-radius: 10px;
  border: 1px solid #1f2937;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: #e5e7eb;

  th, td {
    padding: 12px;
    border-bottom: 1px solid #1f2937;
  }

  th {
    background: #0f172a;
    font-weight: 700;
  }

  tbody tr {
    transition: background 0.2s ease;
  }

  tbody tr:hover {
    background: #111827;
  }
`;

const ViewBtn = styled.button`
  padding: 6px 12px;
  border-radius: 8px;
  background: #1e3a8a;
  border: 1px solid #1e40af;
  color: #dbeafe;
  font-weight: 600;
  cursor: pointer;
  margin-right: 8px;
  transition: all 0.25s ease;

  &:hover {
    background: #1e40af;
  }
`;

const DownloadBtn = styled.button`
  padding: 6px 12px;
  border-radius: 8px;
  background: #064e3b;
  border: 1px solid #065f46;
  color: #d1fae5;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: #065f46;
  }
`;
