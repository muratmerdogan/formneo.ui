const Dot = ({ active } : {active: any}) => {
    return (
      <span
        style={{
          padding: "0px 12px",
          margin: "0 5px",
          cursor: "pointer",
          borderRadius: "50%",
          backgroundColor: `${active ? "black" : "white"}`
        }}
      />
    );
  };
  
  const Dots = ({ content, index } : {content: any, index: any}) => {
    return (
      <div style={{ marginTop: "1rem" }}>
        {content.map((item : any, i : any) => (
          <Dot  key={item.title} active={index === i} />
        ))}
      </div>
    );
  };
  
  export default Dots;
  