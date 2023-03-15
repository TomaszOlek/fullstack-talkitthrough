"use client"

export default function Loader() {
  return (
    <div style={{display: "flex", justifyContent: "center", alignItems: "center", marginTop: "100px"}}>
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}
