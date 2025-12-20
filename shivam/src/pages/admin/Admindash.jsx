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


/* ===================== ENTERPRISE / FAANG UI ===================== */
/* ===================== ADVANCED FAANG STYLE ===================== */

const UserRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 18px;
  margin-bottom: 12px;
  background: linear-gradient(
    120deg,
    rgba(15, 23, 42, 0.75),
    rgba(30, 41, 59, 0.55)
  );
  border-radius: 16px;
  border: 1px solid rgba(99,102,241,0.35);
  color: #e0e7ff;
  backdrop-filter: blur(18px);
  transition: all 0.35s cubic-bezier(.4,0,.2,1);
  animation: slideFade 0.45s ease;

  &:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 18px 40px rgba(99,102,241,0.25);
  }

  @keyframes slideFade {
    from {
      opacity: 0;
      transform: translateY(14px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const VerifyBtn = styled.button`
  padding: 9px 16px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 0 22px rgba(34,197,94,0.65);
  }

  &:active {
    transform: scale(0.96);
  }
`;

const Wrapper = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at top, #0f172a, #000);
  position: relative;
  overflow: hidden;
`;

const Glow = styled.div`
  position: absolute;
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, #6366f1, transparent 70%);
  opacity: 0.22;
  filter: blur(220px);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulseGlow 6s ease-in-out infinite;

  @keyframes pulseGlow {
    0%,100% { opacity: 0.18; }
    50% { opacity: 0.32; }
  }
`;

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  position: relative;
  z-index: 2;
`;

const Sidebar = styled.div`
  width: 280px;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(26px);
  border-right: 1px solid rgba(99,102,241,0.35);
  padding: 2rem 1.8rem;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.5s ease;

  @keyframes slideIn {
    from { transform: translateX(-40px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  animation: fadeDown 0.6s ease;

  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-16px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const NavBtn = styled.button`
  width: 100%;
  padding: 14px 16px;
  margin-bottom: 14px;
  border-radius: 16px;
  border: 1px solid rgba(99,102,241,0.35);
  background: ${({ active }) =>
    active
      ? "linear-gradient(90deg,#6366f1,#818cf8)"
      : "rgba(15,23,42,0.4)"};
  color: ${({ active }) => (active ? "#fff" : "#c7d2fe")};
  font-weight: 800;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(.4,0,.2,1);

  &:hover {
    transform: translateX(10px) scale(1.02);
    background: linear-gradient(90deg,#6366f1,#818cf8);
    color: #fff;
  }
`;

const LogoutBtn = styled.button`
  margin-top: auto;
  width: 100%;
  padding: 15px;
  background: linear-gradient(90deg,#b91c1c,#ef4444);
  border: none;
  border-radius: 16px;
  color: white;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.35s ease;

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 0 28px rgba(239,68,68,0.6);
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 3.2rem;
  animation: fadeIn 0.6s ease;
`;

const Card = styled.div`
  max-width: 920px;
  background: rgba(255,255,255,0.07);
  backdrop-filter: blur(28px);
  border-radius: 28px;
  border: 1px solid rgba(99,102,241,0.35);
  padding: 2.8rem;
  box-shadow: 0 40px 90px rgba(0,0,0,0.55);
  animation: rise 0.45s ease;

  @keyframes rise {
    from { opacity: 0; transform: translateY(20px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
`;

const CardTitle = styled.h3`
  font-size: 24px;
  font-weight: 900;
  color: #eef2ff;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  background: rgba(15,23,42,0.7);
  border: 1px solid rgba(99,102,241,0.5);
  border-radius: 14px;
  color: white;
  margin-bottom: 18px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.35);
  }
`;

const PrimaryButton = styled.button`
  width: 100%;
  background: linear-gradient(90deg,#6366f1,#818cf8);
  padding: 15px;
  border: none;
  border-radius: 16px;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 28px rgba(99,102,241,0.65);
  }
`;

const TableWrapper = styled.div`
  max-height: 400px;
  overflow-y: auto;
  border-radius: 18px;
  border: 1px solid rgba(99,102,241,0.35);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: #e0e7ff;

  th, td {
    padding: 14px;
    border-bottom: 1px solid rgba(99,102,241,0.25);
  }

  th {
    background: rgba(99,102,241,0.18);
    font-weight: 800;
  }

  tbody tr {
    transition: all 0.25s ease;
  }

  tbody tr:hover {
    background: rgba(99,102,241,0.12);
  }
`;

const DeleteBtn = styled.button`
  background: linear-gradient(90deg,#dc2626,#ef4444);
  border: none;
  padding: 9px 16px;
  border-radius: 12px;
  color: white;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 0 18px rgba(239,68,68,0.6);
  }
`;

const ViewBtn = styled.button`
  padding: 7px 14px;
  border-radius: 10px;
  background: linear-gradient(90deg,#2563eb,#3b82f6);
  color: white;
  border: none;
  font-weight: 700;
  cursor: pointer;
  margin-right: 8px;
  transition: all 0.25s ease;

  &:hover {
    transform: scale(1.08);
  }
`;

const DownloadBtn = styled.button`
  padding: 7px 14px;
  border-radius: 10px;
  background: linear-gradient(90deg,#16a34a,#22c55e);
  color: white;
  border: none;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    transform: scale(1.08);
  }
`;
