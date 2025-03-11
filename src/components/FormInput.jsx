import React from 'react';

const FormInput = ({ label, type, value, onChange, required, disabled }) => {
    return (
        <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontWeight: '600' }}>{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                style={{
                    width: '100%',
                    padding: '8px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                placeholder={`Nhập ${label.toLowerCase()}`}
            />
        </div>
    );
};

export default FormInput;