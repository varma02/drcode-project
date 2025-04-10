import React, { useState, useRef } from "react";

const Helper = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const fileInputRef = useRef(null);
  const [editingGroupKey, setEditingGroupKey] = useState(null);
  const [editingFileIndex, setEditingFileIndex] = useState(null);

  const courses = [
    { id: "lego", name: "Lego® Wedo" },
    { id: "scratch", name: "Scratch" },
    { id: "youtube", name: "YouTube Sztár" },
    { id: "web", name: "Webfejlesztés" },
    { id: "unity", name: "Unity" },
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
        level: "Lego Wedo 1.0",
        sessions: [
          "Szivárvány Általános Iskola\nHétfőnként\n14:30 – Kovács Gábor – 6 gyerek",
          "Napraforgó Óvoda\nSzerdánként\n10:00 – Tóth Kitti – 4 gyerek",
          "Tündérkert Iskola\nPéntekenként\n13:30 – Lukács Laura – 5 gyerek",
        ],
      },
      {
        level: "Lego Wedo 2.0",
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
        const totalFiles = uploadedFiles[course.id] ? uploadedFiles[course.id].length : 0;
        return {
          course,
          totalSessions,
          totalStudents,
          totalSchools,
          totalFiles,
        };
      }),
    };
  };
  return (
    <div className="flex justify-center items-start min-h-screen p-8">
      <div className="w-full max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6 text-center text-white">Kurzusok</h2>
        <div className="flex gap-6 mb-8 justify-center">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`flex flex-col items-center gap-2 p-4 border border-gray-300 rounded-md cursor-pointer text-white 
                ${selectedCourse === course.id ? 'bg-gray-300 text-black' : 'hover:bg-gray-300 hover:text-black'}`}
              
              onClick={() => setSelectedCourse(course.id)}
            >
              <span
                className={`text-xl font-semibold ${selectedCourse === course.id ? 'text-black' : 'text-white'}`}
              >
                {course.name}
              </span>
              <div
                className={`text-sm mt-2 ${selectedCourse === course.id ? 'text-black' : 'text-white'} `}
              >
                <p>Összes óra: {calculateStats().coursesDetails.find(c => c.course.id === course.id).totalSessions}</p>
                <p>Összes diák: {calculateStats().coursesDetails.find(c => c.course.id === course.id).totalStudents}</p>
                <p>Összes iskola: {calculateStats().coursesDetails.find(c => c.course.id === course.id).totalSchools}</p>
                <p>Összes fájl: {calculateStats().coursesDetails.find(c => c.course.id === course.id).totalFiles}</p>
              </div>
            </div>
          ))}
        </div>
  
        {selectedCourse && (
          <div className="space-y-6">
            {allGroups[selectedCourse].map((group, groupIndex) => (
              <div key={groupIndex} className="p-4 border border-gray-300 rounded-md">
                <h3 className="text-2xl font-semibold text-white">{group.level}</h3>
                <ul className="mt-4 space-y-2 text-white">
                  {group.sessions.map((session, index) => (
                    <li key={index} className="whitespace-pre-line">{session}</li>
                  ))}
                </ul>
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => handleAddFile(group.level)}
                    className="px-4 py-2 border border-gray-300 text-white rounded-md hover:bg-gray-300 hover:text-black"
                  >
                    Fájl hozzáadása
                  </button>
                  {uploadedFiles[selectedCourse] && uploadedFiles[selectedCourse][group.level] && (
                    <div className="flex gap-2">
                      {uploadedFiles[selectedCourse][group.level].map((file, fileIndex) => (
                        <div
                          key={fileIndex}
                          className="flex items-center gap-2 p-2 border border-gray-300 rounded-md bg-gray-100"
                        >
                          <span>{file.name}</span>
                          <button
                            onClick={() => handleDeleteFile(group.level, fileIndex)}
                            className="text-red-500"
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileChange(e, editingGroupKey)}
        />
      </div>
    </div>
  );
};

export default Helper;
