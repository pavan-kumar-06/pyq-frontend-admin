import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../../Constants";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function UpdateQuestions() {
  const currentUser = useSelector((state) => state.user?.currentUser);
  const { testId } = useParams();

  const [testData, setTestData] = useState(null);
  const [formData, setFormData] = useState({
    subject: "maths",
    questionType: "mcq",
    questionFormat: "image",
    question: "",
    solutionFormat: "image",
    solution: "",
    correctAnswer: "",
  });
  const [selectedButton, setSelectedButton] = useState(null);

  useEffect(() => {
    fetchTest();
  }, []);

  const fetchTest = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/test/${testId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.data?.accessToken}`,
        },
      });
      const data = await response.json();
      if (data.statusCode === 407) {
        //jwt token expired so we will signout the user
        toast.error("Session Expired Please Login Again");
        dispatch(deleteUserSuccess(data));
      }
      setTestData(data.data?.questions);
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleButtonClick = (index) => {
    setSelectedButton(index);
    const newFormData = testData[index] || {
      // Initialize with empty values if testData[index] is null
      subject: "maths",
      questionType: "mcq",
      questionFormat: "image",
      question: "",
      solutionFormat: "image",
      solution: "",
      correctAnswer: "",
    };
    setFormData(newFormData);
  };

  const handleImageDelete = async (e, type) => {
    try {
      let imageUrl;
      if (type === "question") imageUrl = formData?.question;
      else if (type === "solution") imageUrl = formData?.solution;

      const response = await fetch(`${BACKEND_URL}/image?url=${encodeURIComponent(imageUrl)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser?.data?.accessToken}`,
        },
      });
      const data = await response.json();
      if (data.statusCode !== 200) {
        toast.error(data?.message);
      } else {
        toast.success(data?.message);
      }
      if (type === "question") setFormData({ ...formData, question: "" });
      else if (type === "solution") setFormData({ ...formData, solution: "" });
    } catch (error) {
      toast.error("Error deleting question image:", error);
    }
  };

  const handleImageUpload = async (event, type) => {
    const file = event.target.files[0];

    // Check if file is selected
    if (!file) {
      toast.error("No file selected.");
      return;
    }

    // Check file size
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }

    // Check file type (optional)
    const allowedTypes = ["image/jpeg", "image/png"]; // Add more if needed
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPEG and PNG are allowed.");
      return;
    }

    const imageFormData = new FormData();
    imageFormData.append("image", file);

    try {
      const response = await fetch(`${BACKEND_URL}/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentUser?.data?.accessToken}`,
        },
        body: imageFormData,
      });
      const data = await response.json();
      if (!data || data?.statusCode !== 200) {
        toast.error("Error while uploading image");
      }
      toast.success("Image uploaded Successfully");
      if (type === "question") setFormData({ ...formData, question: data?.data });
      else if (type === "solution") setFormData({ ...formData, solution: data?.data });
    } catch (error) {
      toast.error("Error uploading question image:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/update-question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.data?.accessToken}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setTestData(data);
    } catch (error) {
      toast.error("Error updating question:", error);
    }
  };

  return (
    <div className="flex flex-row space-between">
      <div style={{ width: "600px" }}>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <select id="subject" name="subject" value={formData?.subject} onChange={handleChange} required className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="maths">Maths</option>
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
            </select>
          </div>{" "}
          <div>
            <label htmlFor="questionType" className="block text-sm font-medium text-gray-700">
              Question Type
            </label>
            <select id="questionType" name="questionType" value={formData?.questionType} onChange={handleChange} required className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="mcq">MCQ</option>
              <option value="numerical">Numerical</option>
            </select>
          </div>
          <div>
            <label htmlFor="questionFormat" className="block text-sm font-medium text-gray-700">
              Question Format
            </label>
            <select id="questionFormat" name="questionFormat" value={formData?.questionFormat} onChange={handleChange} required className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="image">Image</option>
              <option value="text">Text</option>
            </select>
          </div>
          {formData?.questionFormat === "text" && (
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700">
                Question
              </label>
              <textarea id="question" name="question" value={formData?.question} onChange={handleChange} rows="4" className="border border-gray-300 rounded-md w-full p-2 mt-1" placeholder="Enter your question..."></textarea>
            </div>
          )}
          {formData?.questionFormat === "image" && (
            <div className="flex items-center">
              {formData?.question && (
                <div>
                  <img src={formData?.question} alt="Question" style={{ width: "600px", height: "200px" }} />
                  <button onClick={(e) => handleImageDelete(e, "question")} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Delete Image
                  </button>
                </div>
              )}
              {!formData?.question && (
                <div>
                  <input type="file" onChange={(e) => handleImageUpload(e, "question")} className="mt-2 mr-4" />
                </div>
              )}
            </div>
          )}
          <div>
            <label htmlFor="solutionFormat" className="block text-sm font-medium text-gray-700">
              Solution Format
            </label>
            <select id="solutionFormat" name="solutionFormat" value={formData?.solutionFormat} onChange={handleChange} required className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="image">Image</option>
              <option value="text">Text</option>
            </select>
          </div>
          {formData?.solutionFormat === "text" && (
            <div>
              <label htmlFor="solution" className="block text-sm font-medium text-gray-700">
                Solution
              </label>
              <textarea id="solution" name="solution" value={formData?.solution} onChange={handleChange} rows="4" className="border border-gray-300 rounded-md w-full p-2 mt-1" placeholder="Enter your solution..."></textarea>
            </div>
          )}
          {formData?.solutionFormat === "image" && (
            <div className="flex items-center">
              {formData?.solution && (
                <div>
                  <img src={formData?.solution} alt="Solution" style={{ width: "600px", height: "200px" }} />
                  <button onClick={(e) => handleImageDelete(e, "solution")} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Delete Image
                  </button>
                </div>
              )}
              {!formData?.solution && (
                <div>
                  <input type="file" onChange={(e) => handleImageUpload(e, "solution")} className="mt-2 mr-4" />
                </div>
              )}
            </div>
          )}
          <div>
            <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700">
              Correct Answer
            </label>
            <input id="correctAnswer" name="correctAnswer" value={formData?.correctAnswer} onChange={handleChange} type="text" required className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter the correct answer..." />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-10">
            Save
          </button>
        </form>
      </div>
      <div className="mt-10">
        <div className="grid grid-cols-8 gap-4 border-spacing-1 ">
          {testData &&
            testData.map((data, index) => (
              <button key={index} onClick={() => handleButtonClick(index)} className={index === selectedButton ? "selected" : ""}>
                {index + 1}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

export default UpdateQuestions;
