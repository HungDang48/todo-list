import React from 'react';
import './header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck } from '@fortawesome/free-solid-svg-icons';

type HeaderProps = {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterPriority: "" | 'low' | 'medium' | 'high'; // Cập nhật kiểu ở đây
    setFilterPriority: (priority: "" | 'low' | 'medium' | 'high') => void; // Cập nhật kiểu ở đây
    filterStatus: "" | 'not_started' | 'in_progress' | 'completed'; // Cập nhật kiểu cho filterStatus
    setFilterStatus: (status: "" | 'not_started' | 'in_progress' | 'completed') => void; // Hàm set trạng thái
};

const Header: React.FC<HeaderProps> = ({
    searchTerm,
    setSearchTerm,
    filterPriority,
    setFilterPriority,
    filterStatus,
    setFilterStatus,
}) => {
    return (
        <header className="header">
            <h1><FontAwesomeIcon icon={faListCheck} /> Todo List</h1>
             

            <input
                type="text"
                placeholder="Search task..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />

            <div className="priority-filter-group">
                <label htmlFor="priority-filter" className="priority-label">Priority:</label>

                <select
                    id="priority-filter"
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value as "" | 'low' | 'medium' | 'high')}
                    className="priority-filter"
                >
                    <option value="">All</option>
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                </select>
            </div>

            {/* Add Status Filter Dropdown */}
            <div className="status-filter-group">
                <label htmlFor="status-filter" className="status-label">Status:</label>

                <select
                    id="status-filter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as "" | 'not_started' | 'in_progress' | 'completed')}
                    className="status-filter"
                >
                    <option value="">All Status</option>
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>
        </header>
    );
};

export default Header;
