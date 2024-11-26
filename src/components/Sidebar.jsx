import React from "react";
import {
  IconHome,
  IconActivity,
  IconUser,
  IconFileReport,
  IconSettings,
  IconHeadphones,
  IconLogout,
} from "@tabler/icons-react";
import { Center, Stack, Tooltip, UnstyledButton } from "@mantine/core";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const styles = {
    navbar: {
      width: "80px",
      height: "100vh",
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#228be6", // Mantine blue.6
    },

    navbarMain: {
      flex: 1,
      marginTop: "32px",
    },

    link: {
      width: "40px",
      height: "40px",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      opacity: 0.85,
      transition: "all 0.2s",
      "&:hover": {
        opacity: 1,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      },
    },

    activeLink: {
      opacity: 1,
      backgroundColor: "white",
      color: "#228be6",
    },

    logo: {
      width: "40px",
      height: "40px",
      borderRadius: "8px",
      backgroundColor: "white",
      color: "#228be6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      fontSize: "20px",
    },
  };

  const NavbarLink = ({ icon: Icon, label, active, onClick }) => {
    return (
      <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
        <UnstyledButton
          onClick={onClick}
          style={{
            ...styles.link,
            ...(active ? styles.activeLink : {}),
          }}
        >
          <Icon size={20} stroke={1.5} />
        </UnstyledButton>
      </Tooltip>
    );
  };

  const data = [
    { icon: IconHome, label: "HOME", path: "/Home" },
    { icon: IconActivity, label: "ACCOUNT", path: "/Account" },
    { icon: IconUser, label: "USERS", path: "/Users" },
    { icon: IconFileReport, label: "REPORT", path: "/Report" },
    { icon: IconSettings, label: "SETTING", path: "/settings" },
    { icon: IconHeadphones, label: "SUPPORT", path: "/Support" },
  ];

  const links = data.map((link) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={location.pathname === link.path}
      onClick={() => navigate(link.path)}
    />
  ));

  return (
    <nav style={styles.navbar}>
      <Center>
        <div style={styles.logo}>M</div>
      </Center>

      <div style={styles.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink
          icon={IconLogout}
          label="Logout"
          onClick={() => navigate("/login")}
        />
      </Stack>
    </nav>
  );
};

export default Sidebar;
