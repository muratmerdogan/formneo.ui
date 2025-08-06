import React from "react";
import MDBox from "components/MDBox";
import Slider from "react-slick";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  borderRadius: "lg",
  p: 4,
};

interface photoProps {
  onClose: () => void;
  photos: string[];
}

function ProductImage({ onClose, photos }: photoProps): JSX.Element {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    appendDots: (dots: any) => (
      <div
        style={{
          position: "absolute",
          bottom: "-30px",

          display: "flex",

          justifyContent: "center",
          width: "100%",
        }}
      >
        <ul style={{ margin: 0, width: "100px", fontSize: "10px" }}>{dots}</ul>
      </div>
    ),
  };

  return (
    <MDBox sx={style}>
      <Slider {...settings}>
        {photos.map((photo, index) => (
          <MDBox
            component={"img"}
            key={index}
            sx={{ borderRadius: "20px", width: 700, height: 400 }}
            src={`data:image/png;base64,${photo}`}
            alt={`Product ${index + 1}`}
            width="100%"
            height="100%"
          />
        ))}
      </Slider>
    </MDBox>
  );
}

export default ProductImage;
