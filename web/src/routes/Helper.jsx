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
  const [editingGroupKey, setEditingGroupKey] = useState(null);
  const [editingFileIndex, setEditingFileIndex] = useState(null);

  const courses = [
    { id: "lego", name: "Lego® Wedo", icon: legoIcon },
    { id: "scratch", name: "Scratch", icon: scratchIcon },
    { id: "youtube", name: "YouTube Sztár", icon: youtubeIcon },
    { id: "web", name: "Webfejlesztés", icon: webIcon },
    { id: "unity", name: "Unity", icon: unityIcon },
  ];

  const allGroups = {
    scratch: [
      {
        level: "Scratch kezdő",
        sessions: [
          "Lánchíd Utcai Sport Általános Iskola\nKeddenként\n16:10 – Szabó Anna – 2 gyerek",
          "Petőfi Általános Iskola\nSzerdánként\n15:00 – Kiss Péter – 4 gyerek",
          "Vasvári Pál Iskola\nPéntekenként\n14:30 – Kovács Lilla – 5 gyerek",
        ],
      },
      {
        level: "Scratch haladó",
        sessions: [
          "Kodály Zoltán Gimnázium\nHétfőnként\n16:00 – Tóth Ákos – 3 gyerek",
          "Bolyai Farkas Általános Iskola\nKeddenként\n15:00 – Varga Nóra – 4 gyerek",
          "Jedlik Ányos Iskola\nCsütörtökönként\n14:30 – Németh Bence – 6 gyerek",
        ],
      },
    ],
    lego: [
      {
        level: "Lego Wedo 1",
        sessions: [
          "Szivárvány Általános Iskola\nHétfőnként\n14:30 – Kovács Gábor – 6 gyerek",
          "Napraforgó Óvoda\nSzerdánként\n10:00 – Tóth Kitti – 4 gyerek",
          "Tündérkert Iskola\nPéntekenként\n13:30 – Lukács Laura – 5 gyerek",
        ],
      },
      {
        level: "Lego Wedo 2",
        sessions: [
          "Kölcsey Iskola\nKeddenként\n15:30 – Jakab Kata – 4 gyerek",
          "Kőrösi Csoma Iskola\nCsütörtökönként\n14:00 – Fekete László – 3 gyerek",
          "Bartók Béla Iskola\nPéntekenként\n15:30 – Nagy Csilla – 5 gyerek",
        ],
      },
    ],
    youtube: [
      {
        level: "YouTube Sztár",
        sessions: [
          "Petőfi Sándor Általános Iskola\nCsütörtökönként\n15:00 – Németh Laura – 5 gyerek",
          "Deák Téri Iskola\nSzerdánként\n14:30 – László Petra – 6 gyerek",
          "Kölcsey Gimnázium\nHétfőnként\n16:00 – Juhász Dániel – 4 gyerek",
        ],
      },
    ],
    web: [
      {
        level: "Webfejlesztés",
        sessions: [
          "Kodály Zoltán Gimnázium\nHétfőnként\n15:00 – Kiss Ádám – 7 gyerek",
          "Szent István Gimnázium\nKeddenként\n14:30 – Papp Réka – 6 gyerek",
          "Apáczai Gimnázium\nCsütörtökönként\n15:45 – Tóth Máté – 5 gyerek",
        ],
      },
    ],
    unity: [
      {
        level: "Unity",
        sessions: [
          "Apáczai Gimnázium\nKeddenként\n15:30 – Horváth Róbert – 6 gyerek",
          "Széchenyi Gimnázium\nPéntekenként\n14:00 – Sánta Zsolt – 5 gyerek",
          "Kandó Téri Iskola\nHétfőnként\n16:30 – Török Lili – 4 gyerek",
        ],
      },
    ],
  };

  const calculateGroupStats = (group, files) => {
    const totalSessions = group.sessions.length;
    const totalStudents = group.sessions.reduce((acc, session) => {
      const studentCount = session.match(/(\d+)\s*gyerek/);
      return acc + (studentCount ? parseInt(studentCount[1], 10) : 0);
    }, 0);
    const totalSchools = new Set(group.sessions.map((s) => s.split("\n")[0])).size;
    const totalFiles = files.length;
    return { totalSessions, totalStudents, totalSchools, totalFiles };
  };

  const handleFileChange = (e, groupKey) => {
    const files = e.target.files;
    const newUploadedFiles = { ...uploadedFiles };
    if (!newUploadedFiles[selectedCourse]) newUploadedFiles[selectedCourse] = {};
    if (!newUploadedFiles[selectedCourse][groupKey]) newUploadedFiles[selectedCourse][groupKey] = [];
    newUploadedFiles[selectedCourse][groupKey] = [
      ...newUploadedFiles[selectedCourse][groupKey],
      ...Array.from(files),
    ];
    setUploadedFiles(newUploadedFiles);
  };

  const handleAddFile = (groupKey) => {
    setEditingGroupKey(groupKey);
    fileInputRef.current.click();
  };

  const handleEditFile = (groupKey, fileIndex) => {
    setEditingGroupKey(groupKey);
    setEditingFileIndex(fileIndex);
    fileInputRef.current.click();
  };

  const handleDeleteFile = (groupKey, fileIndex) => {
    const newUploadedFiles = { ...uploadedFiles };
    newUploadedFiles[selectedCourse][groupKey].splice(fileIndex, 1);
    setUploadedFiles(newUploadedFiles);
  };

  const calculateStats = () => {
    return {
      totalCourses: courses.length,
      coursesDetails: courses.map((course) => {
        const groups = allGroups[course.id] || [];
        const totalSessions = groups.reduce((acc, group) => acc + group.sessions.length, 0);
        const totalStudents = groups.reduce((acc, group) => {
          return acc + group.sessions.reduce((sessionAcc, session) => {
            const studentCount = session.match(/(\d+)\s*gyerek/);
            return sessionAcc + (studentCount ? parseInt(studentCount[1], 10) : 0);
          }, 0);
        }, 0);
        const totalSchools = new Set(groups.flatMap((group) => group.sessions.map((s) => s.split("\n")[0]))).size;
        const totalFiles = uploadedFiles[course.id] ? Object.values(uploadedFiles[course.id]).flat().length : 0;
        const totalInstructors = new Set(
          groups.flatMap((group) =>
            group.sessions.map((s) => {
              const match = s.match(/–\s*(.+?)\s*–/);
              return match ? match[1].trim() : null;
            }).filter(Boolean)
          )
        ).size;

        return {
          name: course.name,
          totalSessions,
          totalStudents,
          totalSchools,
          totalFiles,
          totalSubCourses: groups.length,
          totalInstructors,
        };
      }),
    };
  };

  const stats = calculateStats();

  const renderCourseDetails = (courseId) => {
    const groups = allGroups[courseId] || [];
    return (
      <div className="flex flex-col items-center p-4">
        <h1 className="text-4xl font-bold mb-8 text-white">
          {courses.find((c) => c.id === courseId)?.name}
        </h1>
        <div className="flex gap-6 flex-wrap justify-center">
          {groups.map((group, groupIdx) => {
            const groupKey = groupIdx.toString();
            const files = uploadedFiles[courseId]?.[groupKey] || [];
            const stats = calculateGroupStats(group, files);
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
                <h3 className="font-bold text-lg mb-2">Segédletek</h3>
                <ul className="mb-2 space-y-1">
                  {files.map((file, idx) => (
                    <li key={idx} className="flex items-center justify-between">
                      <a
                        href={URL.createObjectURL(file)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        {file.name}
                      </a>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditFile(groupKey, idx)}
                          className="text-xs px-2 py-1 bg-yellow-500 text-white rounded"
                        >
                          Módosítás
                        </button>
                        <button
                          onClick={() => handleDeleteFile(groupKey, idx)}
                          className="text-xs px-2 py-1 bg-red-600 text-white rounded"
                        >
                          Törlés
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleAddFile(groupKey)}
                  className="bg-green-600 text-white px-4 py-1 rounded"
                >
                  Segédlet feltöltése
                </button>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Iskolák száma: {stats.totalSchools}</p>
                  <p>Diákok száma: {stats.totalStudents}</p>
                  <p>Órák száma: {stats.totalSessions}</p>
                  <p>Feltöltött fájlok: {stats.totalFiles}</p>
                </div>
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
          onChange={(e) => handleFileChange(e, editingGroupKey)}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center p-8 text-black">
      {!selectedCourse ? (
        <>
          <h1 className="text-5xl font-bold mb-10 text-white">Kurzusok</h1>
          <div className="flex gap-6 flex-wrap justify-center">
            {courses.map((course) => {
              const courseStats = stats.coursesDetails.find(s => s.name === course.name);
              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourse(course.id)}
                  className="flex flex-col items-center bg-gray-200 p-6 rounded-2xl cursor-pointer hover:bg-gray-300"
                >
                  <img src={course.icon} alt={course.name} className="w-20 h-20 mb-4" />
                  <h3 className="text-xl font-bold">{course.name}</h3>
                  <div className="mt-2 text-sm">
                    <p>Kurzusok száma: {courseStats?.totalSubCourses || 0}</p>
                    <p>Órák száma: {courseStats?.totalSessions || 0}</p>
                    <p>Diákok száma: {courseStats?.totalStudents || 0}</p>
                    <p>Iskolák száma: {courseStats?.totalSchools || 0}</p>
                    <p>Feltöltött fájlok: {courseStats?.totalFiles || 0}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        renderCourseDetails(selectedCourse)
      )}
    </div>
  );
};

export default Helper;
