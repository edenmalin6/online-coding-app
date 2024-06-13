import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import axios, { AxiosError } from "axios";

const CodeBlockPage = () => {
  const { title } = useParams();
  const [codeBlock, setCodeBlock] = useState([]);
  const [isMentor, setIsMentor] = useState(true);

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

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex ">
        <h1 className="mt-5 text-center">{codeBlock.title}</h1>
        <button className="bg-c">Go Back</button>
      </div>
      <div className="pt-5">
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
