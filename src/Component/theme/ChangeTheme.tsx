import React, { useState, useEffect } from 'react';
import './changeTheme.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../context/ThemeContext';


const colors = ['green', 'red', 'orange', 'blue', 'yellow', 'purple', 'pink', 'indigo'];

const ChangeTheme = () => {
  const { theme, themeColor, toggleTheme, setThemeColor } = useTheme();
  const [tempColor, setTempColor] = useState(themeColor);
  const [tempMode, setTempMode] = useState<'light' | 'dark'>(theme);
  

  // Sync with context when component mounts
  useEffect(() => {
    setTempColor(themeColor);
    setTempMode(theme);
  }, [theme, themeColor]);

  // Change temp color (not applied yet)
  const handleColorChange = (color: string) => {
    setTempColor(color as any);
  };

  // Change temp mode (not applied yet)
  const handleModeChange = (mode: 'light' | 'dark') => {
    setTempMode(mode);
  };

  const handleSave = () => {
    // Apply the changes through context
    setThemeColor(tempColor as any);
    if (tempMode !== theme) {
      toggleTheme();
    }
    
    console.log('Selected Color:', tempColor);
    console.log('Selected Mode:', tempMode);
  };

  return (
    <div className={`theme-settings-container ${theme === "dark" ? "bg-black text-light" : ""}`}>
      <div className="header">
        <h1>Change Theme</h1>
      </div>

      <div className={`theme-card ${theme === "dark" ? "bg-dark" : "bg-white"}`}>
        {/* Brand Color Section */}
        <div className="section">
          <h4 className={` ${theme === "dark" ? "text-light" : ""}`}>Brand Color</h4>
          <p className={` ${theme === "dark" ? "text-light" : ""}`}>Select your brand's primary color.</p>
          <div className="color-options">
            {colors.map((color) => (
              <div
                key={color}
                className={`color-circle ${color} ${tempColor === color ? 'active' : ''}`}
                onClick={() => handleColorChange(color)}
              ></div>
            ))}
          </div>
        </div>
        <div className='divider' />

        {/* Interface Theme Section */}
        <div className="section">
          <h4 className={` ${theme === "dark" ? "text-light" : ""}`}>Interface Theme</h4>
          <p className={` ${theme === "dark" ? "text-light" : ""}`}>Select your preferred UI theme.</p>
          <div className="interface-options">
            {/* Light Theme */}
            <label className={`interface-card ${tempMode === 'light' ? 'selected' : ''}`}>
              <div className="layout-preview">
                <div className="layout-header"></div>
                <div className="layout-content">
                  <div className="layout-box large"></div>
                  <div className="layout-box small"></div>
                  <div className="layout-lines"></div>
                </div>
              </div>
              <div className="radio-label">
                <input
                  type="radio"
                  name="themeMode"
                  value="light"
                  checked={tempMode === 'light'}
                  onChange={() => handleModeChange('light')}
                />
                <span>Light</span>
              </div>
            </label>

            {/* Dark Theme */}
            <label className={`interface-card ${tempMode === 'dark' ? 'selected' : ''}`}>
              <div className="layout-preview dark">
                <div className="layout-header"></div>
                <div className="layout-content">
                  <div className="layout-box large"></div>
                  <div className="layout-box small"></div>
                  <div className="layout-lines"></div>
                </div>
              </div>
              <div className="radio-label">
                <input
                  type="radio"
                  name="themeMode"
                  value="dark"
                  checked={tempMode === 'dark'}
                  onChange={() => handleModeChange('dark')}
                />
                <span>Dark</span>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ChangeTheme;