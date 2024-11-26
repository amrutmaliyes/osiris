import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  Stack,
  Button,
  Image,
  Box,
} from "@mantine/core";
import banner  from "../assets/banner.png";

const ProductActivation = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        backgroundImage: 'url("../assets/mountains.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container size={600} sx={{ margin: 0 }}>
        <Paper
          radius="md"
          p={50}
          withBorder
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e0e0e0",
            boxShadow: "0 2px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 40,
            }}
          >
            <Image
              src={banner}
              alt="FutureClass Logo"
              width={120}   // Adjust the width to your desired value
              height={50}   // Adjust the height to your desired value
              fit="contain"
            />
          </Box>

          <Title
            order={1}
            align="center"
            mb={50}
            sx={{
              fontSize: "2.5rem",
              fontWeight: 600,
            }}
          >
            Product Activation Panel
          </Title>

          <Stack spacing="xl">
            <Button
              size="xl"
              color="#E78728"
              h={60}
              onClick={() => navigate("/activation-details")}
              styles={{
                root: {
                  fontSize: "1.2rem",
                  fontWeight: 600,
                },
              }}
            >
              Have Activation Key
            </Button>

            <Button
              size="xl"
              color="#E78728"
              h={60}
              onClick={() => navigate("/activation-form")}
              styles={{
                root: {
                  fontSize: "1.2rem",
                  fontWeight: 600,
                },
              }}
            >
              Register for Activation Key
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProductActivation;
