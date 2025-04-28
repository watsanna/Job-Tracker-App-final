import React, { useState } from "react";
import OverviewModal from "../components/OverviewModal"; // adjust path

const MyProfile = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [modalTitle, setModalTitle] = useState("");

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const interviewData = [
    { company: "Google", date: "2025-04-07" },
    { company: "Amazon", date: "2025-04-08" },
    { company: "Netflix", date: "2025-04-05" },
  ];

  const addStatus = (date) => {
    if (date === today) return "Today";
    return date > today ? "Upcoming" : "Passed";
  };

  const handleTileClick = (type) => {
    if (type === "interview") {
      const itemsWithStatus = interviewData.map((item) => ({
        ...item,
        status: addStatus(item.date),
      }));
      setModalData(itemsWithStatus);
      setModalTitle("Interview");
      setShowModal(true);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      {/* Example stat tile */}
      <div
        onClick={() => handleTileClick("interview")}
        className="cursor-pointer p-4 bg-gray-100 rounded shadow hover:bg-gray-200 w-64"
      >
        <h3 className="text-lg font-semibold">Interviews</h3>
        <p className="text-gray-600">Click to view overview</p>
      </div>

      <OverviewModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
        items={modalData}
      />
    </div>
  );
};

export default MyProfile;
