import React from "react";
import { motion } from "framer-motion";
import noiseDark from "../Images/Style/noise-dark.png";

const LoaderLayout = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 99999,
                backgroundColor: "#181818",
                backgroundImage: `url(${noiseDark})`,
                backdropFilter: "blur(10px)",
            }}
        >
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <h1 className="loadingTxt" style={{ marginTop: 0, textShadow: "0px 0px 20px rgba(255,255,255,0.2)" }}>
                    საიტი იტვირთება...
                </h1>
            </motion.div>
        </motion.div>
    );
};

export default LoaderLayout;