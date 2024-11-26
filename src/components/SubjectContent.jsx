import React, { useState } from "react";
import { Paper, Title, Text, Accordion, Button, Group } from "@mantine/core";

const SubjectContent = ({ subject, classNumber }) => {
  const [selectedChapter, setSelectedChapter] = useState(null);

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

      {/* Overview Section */}
      <Paper shadow="sm" p="md" mb="lg">
        <Group position="apart" mb="md">
          <Title order={3}>Quick Access</Title>
          <Group>
            <Button variant="light" color="blue" size="sm">
              Study Material
            </Button>
            <Button variant="light" color="green" size="sm">
              Practice Questions
            </Button>
            <Button variant="light" color="orange" size="sm">
              Take Test
            </Button>
          </Group>
        </Group>
      </Paper>

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
                <Text fw={500}>{chapter.title}</Text>
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
                      <Group position="apart">
                        <Text size="sm">{topic}</Text>
                        <Group spacing="xs">
                          <Button variant="subtle" size="xs" color="blue">
                            Learn
                          </Button>
                          <Button variant="subtle" size="xs" color="green">
                            Practice
                          </Button>
                        </Group>
                      </Group>
                    </Paper>
                  ))}
                </div>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Paper>

      {/* Progress Section */}
      <Paper shadow="sm" p="md" mt="lg">
        <Group position="apart">
          <div>
            <Title order={3} mb="xs">
              Your Progress
            </Title>
            <Text color="dimmed" size="sm">
              Track your learning journey and complete chapters to earn
              achievements
            </Text>
          </div>
          <Button variant="light" color="grape">
            View Detailed Progress
          </Button>
        </Group>
      </Paper>
    </div>
  );
};

export default SubjectContent;
