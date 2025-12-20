import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserFeedback = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [demats, setDemats] = useState([]);

  const [formData, setFormData] = useState({
    leadId: "",
    feedbackType: "",
    dematAccount: "",
    feedbackTone: "",
    urgencyLevel: "",

    customerName: "",
    contactNumber: "",
    gender: "",
    customerId: "",
    email: "",
    accountOpeningDate: "",
    city: "",
    state: "",
    language: "",

    openMode: "",
    easeRating: "",
    guidance: "",
    activationRating: "",
    documents: "",

    supportContacted: "",
    supportRating: "",

    improvements: "",
    technicalIssues: "",
    recommend: "",
    overallRating: "",

    consent: "",
    contactMethod: "",
    bestTime: "",

    telecallerName: "",
  });

  /* ================= DISABLE COPY / PASTE ================= */
  const disableCopyPaste = (e) => e.preventDefault();
  const disableDrop = (e) => e.preventDefault();

  /* ================= LOAD USER ================= */
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
    } else {
      setName(
        user.fullName
          .toLowerCase()
          .split(" ")
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      );
    }
  }, [navigate]);

  /* ================= FETCH DEMATS ================= */
  useEffect(() => {
    const fetchDemats = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/all-demats`
        );
        setDemats(res.data.data);
      } catch {
        toast.error("Failed to load demat accounts");
      }
    };
    fetchDemats();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/submit`,
        formData,
        { withCredentials: true }
      );
      toast.success("Feedback submitted successfully");
    } catch {
      toast.error("Submission failed");
    }
  };

  const logoutHandler = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/logout`,
        {},
        { withCredentials: true }
      );
    } catch {}
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Wrapper>
      <Form
        onSubmit={submitHandler}
        onPaste={disableCopyPaste}
        onCopy={disableCopyPaste}
        onCut={disableCopyPaste}
        onDrop={disableDrop}
      >
        <Header>
          <h2>
            Welcome <br />
            <span>{name}</span>
          </h2>
          <p>Customer Feedback Form</p>
        </Header>

        <Section>Nature of Feedback</Section>
        <Input name="leadId" placeholder="Lead ID" onChange={handleChange} />

        <Select name="feedbackType" onChange={handleChange}>
          <option value="">Select Feedback Category</option>
          <option>Service Related Complaint</option>
          <option>Service Improvement Suggestion</option>
          <option>General Query</option>
          <option>Critical Issue</option>
          <option>Appreciation / Positive Feedback</option>
        </Select>

        <Select name="dematAccount" onChange={handleChange}>
          <option value="">Select Demat Platform</option>
          {demats.map((d) => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </Select>

        <Select name="feedbackTone" onChange={handleChange}>
          <option value="">Nature of Feedback</option>
          <option>Formal</option>
          <option>Detailed</option>
          <option>Brief</option>
        </Select>

        <Select name="urgencyLevel" onChange={handleChange}>
          <option value="">Urgency Level</option>
          <option>Normal</option>
          <option>High Priority</option>
          <option>Immediate Attention Required</option>
        </Select>

        <Section>Personal Information</Section>
        <Input name="customerName" placeholder="Customer Full Name" onChange={handleChange} />
        <Input name="contactNumber" placeholder="Contact Number" onChange={handleChange} />
        <Select name="gender" onChange={handleChange}>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </Select>

        <Input name="customerId" placeholder="Customer ID" onChange={handleChange} />
        <Input name="email" placeholder="Email Address" onChange={handleChange} />
        <Input type="date" name="accountOpeningDate" onChange={handleChange} />
        <Input name="city" placeholder="City" onChange={handleChange} />
        <Input name="state" placeholder="State" onChange={handleChange} />
        <Input name="language" placeholder="Preferred Language" onChange={handleChange} />

        <Section>Account Opening Experience</Section>
        <Select name="openMode" onChange={handleChange}>
          <option value="">Mode of Account Opening</option>
          <option>Online</option>
          <option>In-person</option>
          <option>Authorized Agent</option>
        </Select>

        <Textarea name="guidance" placeholder="Guidance during process" onChange={handleChange} />
        <Textarea name="documents" placeholder="Documents & smoothness" onChange={handleChange} />

        <Section>Customer Support</Section>
        <Select name="supportContacted" onChange={handleChange}>
          <option value="">Did you contact support?</option>
          <option>Yes</option>
          <option>No</option>
        </Select>

        <Section>Features & Recommendations</Section>
        <Textarea name="improvements" placeholder="Suggested improvements" onChange={handleChange} />
        <Textarea name="technicalIssues" placeholder="Technical issues faced" onChange={handleChange} />

        <Select name="recommend" onChange={handleChange}>
          <option value="">Would you recommend us?</option>
          <option>Yes</option>
          <option>No</option>
        </Select>

        <Section>Consent & Follow-Up</Section>
        <Select name="consent" onChange={handleChange}>
          <option value="">Consent for follow-up</option>
          <option>Yes</option>
          <option>No</option>
        </Select>

        <Section>Telecaller Information</Section>
        <Input name="telecallerName" placeholder="Telecaller Name" onChange={handleChange} />

        <Submit>Submit Feedback</Submit>

        <ActionButton type="button" onClick={() => navigate("/view-feedback")}>
          View Feedback
        </ActionButton>

        <LogoutButton type="button" onClick={logoutHandler}>
          Logout
        </LogoutButton>
      </Form>
    </Wrapper>
  );
};

export default UserFeedback;

/* ===================== STYLES ===================== */

const Wrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #eef2ff, #f8fafc);
  display: flex;
  justify-content: center;
  padding: 2.5rem;
`;

const Form = styled.form`
  width: 650px;
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(16px);
  padding: 2.8rem;
  border-radius: 22px;
  box-shadow: 0 30px 60px rgba(0,0,0,0.18);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.6rem;

  h2 { font-size: 30px; font-weight: 800; }
  span { color: #2563eb; }
  p { margin-top: 6px; font-size: 14px; color: #475569; }
`;

const Section = styled.div`
  background: linear-gradient(90deg, rgba(37,99,235,0.1), rgba(37,99,235,0.02));
  border-left: 5px solid #2563eb;
  padding: 14px 16px;
  margin: 2.2rem 0 1.2rem;
  border-radius: 14px;
  font-weight: 700;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 12px;
  border: 1px solid #c7d2fe;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 12px;
  border: 1px solid #c7d2fe;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  min-height: 90px;
  border-radius: 12px;
  border: 1px solid #c7d2fe;
  margin-bottom: 12px;
`;

const Submit = styled.button`
  width: 100%;
  background: linear-gradient(90deg, #1e3a8a, #2563eb);
  color: white;
  padding: 15px;
  border: none;
  border-radius: 14px;
  font-weight: 800;
  margin-top: 1.5rem;
`;

const ActionButton = styled.button`
  width: 100%;
  background: linear-gradient(90deg, #0f766e, #14b8a6);
  color: white;
  padding: 14px;
  border: none;
  border-radius: 14px;
  margin-top: 0.9rem;
  font-weight: 700;
`;

const LogoutButton = styled.button`
  width: 100%;
  background: linear-gradient(90deg, #991b1b, #dc2626);
  color: white;
  padding: 14px;
  border: none;
  border-radius: 14px;
  margin-top: 0.8rem;
  font-weight: 700;
`;
