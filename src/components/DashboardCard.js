import React from 'react'
import { List } from "phosphor-react";

const DashboardCard = ({name, count , route ,  img}) => {
  return (
    <div className="col-lg-4 col-md-12 col-6 mb-4">
    <div className="card">
      <div className="card-body">
        <div className="card-title d-flex align-items-start justify-content-between">
          <div className="avatar flex-shrink-0">
            <img
              src={img}
              alt="chart success"
              className="rounded"
            />
          </div>
          <div className="dropdown">
            <button
              className="btn p-0"
              type="button"
              id="cardOpt3"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <List size={24} />
            </button>
            <div
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="cardOpt3"
            >
              <a className="dropdown-item" href={route}>
                View More
              </a>
            </div>
          </div>
        </div>
        <span className="fw-semibold d-block mb-1">
          {name} 
        </span>
        <h3 className="card-title mb-2">{count}</h3>
      </div>
    </div>
  </div>
  )
}

export default DashboardCard