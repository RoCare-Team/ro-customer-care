"use client";

import React, { useEffect } from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function CongratsModal({ setShowCongrats, open }) {
  const handleClose = () => {
    setShowCongrats(false);
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        handleClose();
      }, 800); // Auto-close after 800ms

      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="congratulations-modal"
      aria-describedby="account-creation-success"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: 24,
          p: { xs: 3, sm: 4, md: 6 },
          maxWidth: "500px",
          width: { xs: "90%", sm: "80%", md: "100%" },
          textAlign: "center",
        }}
      >
        {/* Close Button */}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "text.secondary",
            "&:hover": {
              color: "text.primary",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Emoji Icon */}
        <Box
          sx={{
            mb: 3,
            display: "inline-block",
            p: 2,
            bgcolor: "grey.100",
            borderRadius: "50%",
          }}
        >
          <Typography variant="h3" component="span" role="img" aria-label="party popper">
            🎉
          </Typography>
        </Box>

        {/* Heading */}
        <Typography
          variant="h5"
          component="h2"
          fontWeight="600"
          sx={{
            mb: 1,
            color: "primary.main",
            fontSize: { xs: "1.5rem", sm: "1.75rem" },
          }}
        >
          Congratulations! Your Account Created Successfully
        </Typography>

        {/* Description */}
        <Typography variant="body1" color="text.secondary">
          Now you can add services and offers on the platform.
        </Typography>
      </Box>
    </Modal>
  );
}

export default CongratsModal;
