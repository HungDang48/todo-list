import React from 'react';
import './header.css';

type HeaderProps = {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterPriority: "" | 'low' | 'medium' | 'high'; // Cập nhật kiểu ở đây
    setFilterPriority: (priority: "" | 'low' | 'medium' | 'high') => void; // Cập nhật kiểu ở đây
};

const Header: React.FC<HeaderProps> = ({
    searchTerm,
    setSearchTerm,
    filterPriority,
    setFilterPriority,
}) => {
    return (
        <header className="header">
            <h2>📋 Todo List</h2>

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
        </header>
    );
};

export default Header;
