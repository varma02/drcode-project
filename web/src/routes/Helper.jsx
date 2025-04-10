import React, { useState, useRef } from "react";
import legoIcon from "../assets/lego.png";
import scratchIcon from "../assets/scratch.png";
import youtubeIcon from "../assets/youtube.png";
import webIcon from "../assets/web.png";
import unityIcon from "../assets/unity.png";

const Helper = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const fileInputRef = useRef(null);

  const courses = [
    { id: "lego", name: "Lego® Wedo", icon: legoIcon },
    { id: "scratch", name: "Scratch", icon: scratchIcon },
    { id: "youtube", name: "YouTube Sztár", icon: youtubeIcon },
    { id: "web", name: "Webfejlesztés", icon: webIcon },
    { id: "unity", name: "Unity", icon: unityIcon },
  ];

  const handleAddFile = (groupKey) => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFiles((prev) => {
      const courseFiles = prev[selectedCourse] || {};
      const groupFiles = courseFiles[groupKey] || [];

      groupFiles.push(file);

      return {
        ...prev,
        [selectedCourse]: {
          ...courseFiles,
          [groupKey]: [...groupFiles],
        },
      };
    });

    e.target.value = ""; // reset file input to allow same file re-upload
  };

  const renderCourseDetails = (courseId) => {
    const groups = allGroups[courseId] || [];
    return (
      <div className="flex flex-col items-center p-4">
        <h1 className="text-4xl font-bold mb-8">
          {courses.find((c) => c.id === courseId)?.name}
        </h1>
        <div className="flex gap-6 flex-wrap justify-center">
          {groups.map((group, groupIdx) => {
            const groupKey = groupIdx.toString();
            const files = uploadedFiles[courseId]?.[groupKey] || [];
            return (
              <div key={groupIdx} className="bg-gray-200 p-6 rounded-2xl max-w-sm">
                <h2 className="text-xl font-bold mb-4">{group.level}</h2>
                <div className="space-y-2 mb-4">
                  {group.sessions.map((session, i) => (
                    <p key={i} className="border-b pb-2 whitespace-pre-line">
                      {session}
                    </p>
                  ))}
                </div>
                <h3 className="font-bold text-lg mb-2">Feltöltött fájlok</h3>
                <ul className="mb-2 space-y-1">
                  {files.length > 0 ? (
                    files.map((file, idx) => (
                      <li key={idx} className="flex items-center justify-between">
                        <a
                          href={URL.createObjectURL(file)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-sm"
                        >
                          {file.name}
                        </a>
                      </li>
                    ))
                  ) : (
                    <p>Nincs feltöltött fájl.</p>
                  )}
                </ul>
                <button
                  onClick={() => handleAddFile(groupKey)}
                  className="bg-green-600 text-white px-4 py-1 rounded"
                >
                  Új fájl feltöltése
                </button>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => setSelectedCourse(null)}
          className="mt-8 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Vissza
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center p-8 text-black">
      {!selectedCourse ? (
        <>
          <h1 className="text-5xl font-bold mb-10 text-black">Kurzusok</h1>
          <div className="flex gap-6 flex-wrap justify-center">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-gray-200 rounded-2xl p-4 flex flex-col items-center w-40 cursor-pointer hover:scale-105 transition"
                onClick={() => setSelectedCourse(course.id)}
              >
                <img src={course.icon} alt={course.name} className="h-20 mb-2" />
                <span className="text-center font-medium">{course.name}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        renderCourseDetails(selectedCourse)
      )}
    </div>
  );
};

export default Helper;
