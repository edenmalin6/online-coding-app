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
  }, []);

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
