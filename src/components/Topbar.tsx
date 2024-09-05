import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const Topbar = () => {
    return (
        <Box px={7} sx={{height: 100, borderBottom: '1px solid #000', display: "flex", alignItems: "center",}}>
            <Typography variant={"h4"} fontWeight={500} fontFamily={"inherit"}>Home assignment</Typography>
        </Box>

    );
}