import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import axios, { AxiosError } from "axios";

const CodeBlockPage = () => {
  const { title } = useParams();
  const [codeBlock, setCodeBlock] = useState([]);
  const [isMentor, setIsMentor] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    async function getCodeBlock() {
      let response;
      try {
        response = await axios.get(
          `http://localhost:8080/api/code-block/${title}`
        );
        setCodeBlock(response.data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
          console.log(error.response.data);
        } else {
          console.log(error.message);
        }
      }
    }
    async function setMentor() {
      try {
        await axios.post(
          `http://localhost:8080/api/code-block/${encodeURIComponent(
            title
          )}/lock`
        );
        setIsMentor(true);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.data) {
            console.log(error.response?.data);
            // } else if (error.response.status === 423) {
            //   setIsMentor(false);
          }
        } else {
          console.log(error.message);
        }
      }
    }
    getCodeBlock().then((resData) => {
      if (resData.locked) {
        setIsMentor(false);
      } else {
        setMentor();
      }
    });

  // Set up SSE connection
    const eventSource = new EventSource("http://localhost:8080/events");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.title === title) {
        setCodeBlock(data);
      }
    };

    eventSource.onerror = (event) => {
      console.error("EventSource failed:", event);
      eventSource.close();
    };

    // Clean up SSE connection when the component unmounts
    return () => {
      eventSource.close();
    };
  }, [title]);

  const handleCodeEdit = async (newCode) => {
    try {
      await axios.post(
        `http://localhost:8080/api/code-block/${encodeURIComponent(title)}`,
        {
          code: newCode,
        }
      );
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  };
const goBackBtn = () => {
  navigate(-1)
}
  return (
    <div className="">  
        <h1 className="text-center text-xl">{codeBlock.title}</h1> 
        <button
        onClick={goBackBtn}
         className="bg-blue-800 hover:bg-blue-900
         text-white font-bold py-2
          px-4 rounded-full ml-[230px]">
           Go Back
        </button>
      <div className="pt-5 flex flex-col items-center justify-center">
        <Editor
          height="250px"
          width="800px"
          theme="vs-dark"
          defaultLanguage="javascript"
          value={codeBlock.code}
          options={{ readOnly: isMentor }}
          onChange={handleCodeEdit}
        />
      </div>
    </div>
  );
};

export default CodeBlockPage;
