import React, { useState } from "react";
import { Box, NavLink, Collapse } from "@mantine/core";
import {
  IconBook,
  IconChevronRight,
  IconChevronDown,
} from "@tabler/icons-react";

const SubjectSidebar = ({ subject, classNumber }) => {
  const [openChapter, setOpenChapter] = useState(0);

  const chapters = [
    {
      title: "Chapter 1: Number Systems",
      concepts: [
        "1.1 Irrational Numbers",
        "1.2 Real Numbers and Their Decimal Expansions",
        "1.3 Representing Real Numbers on the Number Line",
        "1.4 Operations on Real Numbers",
        "1.5 Laws of Exponents for Real Numbers",
      ],
    },
    {
      title: "Chapter 2: Polynomials",
      concepts: [
        "2.1 Introduction to Polynomials",
        "2.2 Degree of Polynomial",
        "2.3 Addition and Subtraction",
        "2.4 Multiplication of Polynomials",
        "2.5 Factorization",
      ],
    },
    {
      title: "Chapter 3: Coordinate Geometry",
      concepts: [
        "3.1 Cartesian System",
        "3.2 Plotting Points",
        "3.3 Lines and Curves",
        "3.4 Distance Formula",
        "3.5 Area of Shapes",
      ],
    },
  ];

  return (
    <Box
      w={300}
      style={{
        borderRight: "1px solid #eee",
        backgroundColor: "#f8f9fa",
        padding: "20px",
        height: "calc(100vh - 100px)",
        overflowY: "auto",
      }}
    >
      <h3 style={{ marginBottom: "20px", padding: "0 10px" }}>
        {subject} - Class {classNumber}
      </h3>

      {chapters.map((chapter, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <NavLink
            label={chapter.title}
            leftSection={<IconBook size="1rem" />}
            rightSection={
              openChapter === index ? (
                <IconChevronDown size="1rem" />
              ) : (
                <IconChevronRight size="1rem" />
              )
            }
            active={openChapter === index}
            onClick={() => setOpenChapter(openChapter === index ? -1 : index)}
            styles={{
              root: {
                borderRadius: "8px",
              },
            }}
          />

          <Collapse in={openChapter === index}>
            <div style={{ paddingLeft: "20px" }}>
              {chapter.concepts.map((concept, i) => (
                <NavLink
                  key={i}
                  label={concept}
                  color="pink"
                  styles={{
                    root: {
                      fontSize: "0.9em",
                      borderRadius: "4px",
                    },
                  }}
                />
              ))}
            </div>
          </Collapse>
        </div>
      ))}
    </Box>
  );
};

export default SubjectSidebar;
