import React, { useState, useRef } from "react";

const Helper = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const fileInputRef = useRef(null);
  const [currentGroup, setCurrentGroup] = useState(null);

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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!selectedCourse || !currentGroup) return;
    const newFiles = { ...uploadedFiles };
    if (!newFiles[selectedCourse]) newFiles[selectedCourse] = {};
    if (!newFiles[selectedCourse][currentGroup]) newFiles[selectedCourse][currentGroup] = [];
    newFiles[selectedCourse][currentGroup] = [...newFiles[selectedCourse][currentGroup], ...files];
    setUploadedFiles(newFiles);
    e.target.value = null;
  };

  const handleDeleteFile = (groupKey, fileIndex) => {
    const newFiles = { ...uploadedFiles };
    newFiles[selectedCourse][groupKey].splice(fileIndex, 1);
    setUploadedFiles(newFiles);
  };

  const getCourseStats = (courseId) => {
    const groups = allGroups[courseId] || [];
    const sessions = groups.flatMap((g) => g.sessions);
    const students = sessions.reduce((sum, s) => {
      const match = s.match(/(\d+)\s*gyerek/);
      return sum + (match ? parseInt(match[1], 10) : 0);
    }, 0);
    const schools = new Set(sessions.map((s) => s.split("\n")[0])).size;
    const files = uploadedFiles[courseId] || {};
    const fileCount = Object.values(files).reduce((acc, f) => acc + f.length, 0);
    return { sessionCount: sessions.length, students, schools, fileCount };
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <h2 className="text-3xl font-normal mb-6 text-center text-white">Kurzusok</h2>
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        {courses.map((course) => {
          const stats = getCourseStats(course.id);
          return (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course.id)}
              className={`flex flex-col items-center gap-2 p-4 border border-zinc-800 rounded-md cursor-pointer text-white w-48
                ${selectedCourse === course.id ? "bg-zinc-900" : "hover:bg-zinc-900"}`}
            >
              <span className="font-semibold">{course.name}</span>
              <div className="text-sm mt-2">
                <p>Órák: {stats.sessionCount}</p>
                <p>Diákok: {stats.students}</p>
                <p>Iskolák: {stats.schools}</p>
                <p>Segédletek: {stats.fileCount}</p>
              </div>
            </div>
          );
        })}
      </div>

      {selectedCourse && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {allGroups[selectedCourse].map((group) => (
            <div key={group.level} className="p-4 border border-zinc-800 rounded-md text-white">
              <h3 className="text-2xl font-semibold">{group.level}</h3>
              <ul className="text-sm mt-4 space-y-2">
                {group.sessions.map((session, i) => (
                  <li key={i} className="whitespace-pre-line">
                    {session}
                    {i !== group.sessions.length - 1 && <div className="border-b border-zinc-800 my-2" />}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setCurrentGroup(group.level);
                    fileInputRef.current.click();
                  }}
                  className="px-3 py-2 text-sm border border-zinc-800 rounded hover:bg-zinc-900 w-fit"
                >
                  Segédlet feltöltése
                </button>
                {uploadedFiles[selectedCourse]?.[group.level] && (
                  <div className="flex flex-wrap gap-2">
                    {uploadedFiles[selectedCourse][group.level].map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 border border-zinc-800 rounded-md hover:bg-zinc-900"
                      >
                        <span className="text-sm truncate max-w-[150px]">{file.name}</span>
                        <button
                          onClick={() => handleDeleteFile(group.level, index)}
                          className="text-red-500 text-sm"
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
        onChange={handleFileChange}
      />
    </div>
  );
};

export default Helper;
