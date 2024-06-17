import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Link } from "react-router-dom";

const LobbyPage = () => {
  const [codeBlocks, setCodeBlocks] = useState([]);

  useEffect(() => {
    async function getCodeBlocks() {
      let response;
      try {
        response = await axios.get("http://localhost:8080/api/lobby");
        setCodeBlocks(response.data);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
          console.log(error.response.data);
        } else {
          console.log(error.message);
        }
      }
    }
    getCodeBlocks();

    //Set SSE connection
    const eventSource = new EventSource("http://localhost:8080/events");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleUpdate(data);
    };

    eventSource.onerror = (event) => {
      console.error("EventSource failed:", event);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleUpdate = (data) => {
    const { title } = data;

    // Update the code blocks state based on incoming data
    setCodeBlocks((prevCodeBlocks) => {
      const existingCodeBlockIndex = prevCodeBlocks.findIndex(
        (block) => block === title
      );

      if (existingCodeBlockIndex !== -1) {
        // If the code block already exists, update it
        return prevCodeBlocks.map((block, index) =>
          index === existingCodeBlockIndex ? title : block
        );
      } else {
        // If the code block doesn't exist, add it
        return [...prevCodeBlocks, title];
      }
    });
  };

  return (
    <div className="text-center ">
      <h1 className="py-16">Choose a code block</h1>
      <ul>
        {codeBlocks.map((title, index) => (
          <li key={index}>
            <Link className="hover:text-blue-800" to={`/code-block/${title}`}>
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LobbyPage;
