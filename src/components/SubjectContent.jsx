import React, { useState } from "react";
import {
  Paper,
  Title,
  Text,
  Accordion,
  Button,
  Group,
  Progress,
} from "@mantine/core";

const SubjectContent = ({ subject, classNumber }) => {
  const [selectedChapter, setSelectedChapter] = useState(null);

  // Mock progress data - replace with real data later
  const chapterProgress = {
    Math: {
      "Chapter 1: Real Numbers": 75,
      "Chapter 2: Polynomials": 30,
      "Chapter 3: Pair of Linear Equations": 0,
    },
    Physics: {
      "Chapter 1: Light - Reflection and Refraction": 60,
      "Chapter 2: Electricity": 25,
    },
    Chemistry: {
      "Chapter 1: Chemical Reactions and Equations": 90,
      "Chapter 2: Acids, Bases and Salts": 45,
    },
  };

  // Content structure for each subject
  const subjectContent = {
    Math: {
      chapters: [
        {
          title: "Chapter 1: Real Numbers",
          topics: [
            "Euclid's Division Lemma",
            "The Fundamental Theorem of Arithmetic",
            "Revisiting Irrational Numbers",
            "Revisiting Rational Numbers and Their Decimal Expansions",
          ],
        },
        {
          title: "Chapter 2: Polynomials",
          topics: [
            "Geometrical Meaning of the Zeroes of a Polynomial",
            "Relationship between Zeroes and Coefficients of a Polynomial",
            "Division Algorithm for Polynomials",
          ],
        },
        {
          title: "Chapter 3: Pair of Linear Equations",
          topics: [
            "Graphical Method of Solution of a Pair of Linear Equations",
            "Algebraic Methods of Solving a Pair of Linear Equations",
            "Equations Reducible to a Pair of Linear Equations in Two Variables",
          ],
        },
      ],
    },
    Physics: {
      chapters: [
        {
          title: "Chapter 1: Light - Reflection and Refraction",
          topics: [
            "Reflection of Light",
            "Spherical Mirrors",
            "Refraction of Light",
            "Optical Instruments",
          ],
        },
        {
          title: "Chapter 2: Electricity",
          topics: [
            "Electric Current and Circuit",
            "Electric Potential and Potential Difference",
            "Ohm's Law",
            "Factors Affecting Resistance",
          ],
        },
      ],
    },
    Chemistry: {
      chapters: [
        {
          title: "Chapter 1: Chemical Reactions and Equations",
          topics: [
            "Chemical Equations",
            "Types of Chemical Reactions",
            "Oxidation and Reduction",
            "Effects of Oxidation",
          ],
        },
        {
          title: "Chapter 2: Acids, Bases and Salts",
          topics: [
            "Understanding pH Scale",
            "Importance of pH in Everyday Life",
            "More About Salts",
            "Chemicals from Common Salt",
          ],
        },
      ],
    },
    // Add more subjects as needed
  };

  const currentSubject = subjectContent[subject] || { chapters: [] };

  return (
    <div style={{ padding: "20px" }}>
      <Title order={2} mb="xl">
        {subject} - Class {classNumber}
      </Title>

      {/* Chapters Section */}
      <Paper shadow="sm" p="md">
        <Title order={3} mb="lg">
          Chapters & Topics
        </Title>

        <Accordion
          variant="separated"
          radius="md"
          defaultValue={currentSubject.chapters[0]?.title}
        >
          {currentSubject.chapters.map((chapter, index) => (
            <Accordion.Item key={index} value={chapter.title}>
              <Accordion.Control>
                <div style={{ width: "100%" }}>
                  <Group position="apart" mb={8}>
                    <Text fw={500}>{chapter.title}</Text>
                    <Text size="sm" color="dimmed">
                      {chapterProgress[subject]?.[chapter.title] || 0}% Complete
                    </Text>
                  </Group>
                  <Progress
                    value={chapterProgress[subject]?.[chapter.title] || 0}
                    size="sm"
                    radius="xl"
                    color={
                      chapterProgress[subject]?.[chapter.title] === 100
                        ? "green"
                        : "orange"
                    }
                  />
                </div>
              </Accordion.Control>
              <Accordion.Panel>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {chapter.topics.map((topic, i) => (
                    <Paper
                      key={i}
                      p="sm"
                      withBorder
                      style={{
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#f8f9fa";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <Group position="apart" style={{ width: "100%" }}>
                        <Text size="sm">{topic}</Text>
                        <Button
                          variant="subtle"
                          size="xs"
                          color="orange"
                          style={{ marginLeft: "auto" }}
                        >
                          watch
                        </Button>
                      </Group>
                    </Paper>
                  ))}
                </div>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Paper>
    </div>
  );
};

export default SubjectContent;
