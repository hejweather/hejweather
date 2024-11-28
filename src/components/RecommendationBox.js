import React from "react";

const RecommendationBox = ({ recommendation }) => (
  <div className="recommendation-box">
    <h3>Recommendation!</h3>
    <p>{recommendation}</p>
  </div>
);

export default RecommendationBox;
