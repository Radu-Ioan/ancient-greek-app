function ImageBox(props: any) {
  const { imageUrl } = props;
  return (
    <div
      className="d-flex justify-content-sm-center mt-2"
      style={{ height: "200px" }}
    >
      <img
        src={imageUrl}
        alt="Question image"
        className="w-100 w-sm-auto"
        style={{
          objectFit: "contain",
          borderRadius: "10px",
        }}
      />
    </div>
  );
}

export default ImageBox;
