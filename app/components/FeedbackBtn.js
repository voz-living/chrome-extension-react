import React from 'react';

const FeedbackBtn = () => (
  <div className="btn-group">
    <a
      className="btn tooltip-right"
      href="https://voz-living.github.io/voz-living-feedback/"
      style={{ fontSize: '20px' }}
      target="_blank"
      data-tooltip="Góp ý/Báo lỗi/Tâm sự"
    ><i className="fa fa-envelope-o"></i></a>
  </div>
);

export default FeedbackBtn;
