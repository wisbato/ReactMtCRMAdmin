import './addpermission.css'
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMenu } from '../../../api/menu/getMenu';
import { getGroup } from '../../../api/group/getGroup';
import { Badge, Alert } from 'react-bootstrap';
import { useMutation } from '@tanstack/react-query';
import { UpdateSubadminPermissions, updateSubadminPermissions } from '../../../api/subadmin/updateSubadminPermissions';
import { toast } from 'react-hot-toast';
import { useTheme } from "../../../context/ThemeContext";

interface MenuItem {
  id: number;
  label: string;
}

interface MenuCategory {
  [key: string]: MenuItem[];
}

interface Group {
  id: number;
  groupName: string;
  mt5GroupName: string;
}

const Addpermission = () => {
  const { theme } = useTheme();
  
  // Add mutation for updating permissions
  const { mutate: updatePermissions, isPending: isSubmitting } = useMutation({
    mutationFn: updateSubadminPermissions,
    onSuccess: (data) => {
      toast.success(data.message || "Permissions updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update permissions");
    }
  });

  // Get subadmin data from navigation state
  const location = useLocation();
  const subadmin = location.state?.subadmin;

  // State for group selection
  const [groupSearchTerm, setGroupSearchTerm] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [selectedMenuIds, setSelectedMenuIds] = useState<number[]>([]);

  // Initialize selected groups with existing groups when component mounts
  useEffect(() => {
    if (subadmin) {
      if (subadmin.permissiontype === "MT5GroupWise" && subadmin.groupPermissions) {
        setSelectedGroups(subadmin.groupPermissions);
      }
      
      // Initialize selected menu IDs if they exist
      if (subadmin.permissiontype === "MenuWise" && subadmin.menuPermissions) {
        setSelectedMenuIds(subadmin.menuPermissions.map((menu: any) => menu.id));
      }
    }
  }, [subadmin]);

  const { data, isLoading, isError, error } = useQuery<MenuCategory>({
    queryKey: ['menuItems'],
    queryFn: getMenu
  });

  // Fetch groups for selection - only if subadmin is MT5GroupWise type
  const {
    data: groupsData,
    isLoading: isLoadingGroups,
    error: groupsError,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroup,
    staleTime: 5 * 60 * 1000,
    enabled: subadmin?.permissiontype === "MT5GroupWise" // Only fetch if needed
  });

  const groups = Array.isArray(groupsData?.groups) ? groupsData?.groups : [];

  // Filter groups based on search term and exclude already selected groups
  const filteredGroups = groups?.filter(
    (group: Group) =>
      group.groupName.toLowerCase().includes(groupSearchTerm.toLowerCase()) &&
      !selectedGroups.some((selected) => selected.id === group.id)
  );

  const handleGroupSelect = (group: Group) => {
    setSelectedGroups([...selectedGroups, group]);
    setGroupSearchTerm("");
    setShowGroupDropdown(false);
  };

  const removeGroup = (groupId: number) => {
    setSelectedGroups(selectedGroups.filter((group) => group.id !== groupId));
  };

  const handleGroupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupSearchTerm(e.target.value);
    setShowGroupDropdown(true);
  };

  const handleGroupInputFocus = () => {
    setShowGroupDropdown(true);
  };

  const handleGroupInputBlur = () => {
    setTimeout(() => setShowGroupDropdown(false), 200);
  };

  // Add checkbox handler
const handleMenuCheckboxChange = (menuId: number, isChecked: boolean) => {
  setSelectedMenuIds(prev => 
    isChecked 
      ? [...prev, menuId] 
      : prev.filter(id => id !== menuId)
  );
};

  const handleSubmit = () => {
    // Prepare the data based on permission type
    const permissionData: UpdateSubadminPermissions = {
      userId: subadmin.id.toString(),
    };

    if (subadmin.permissiontype === "MenuWise") {
      // TODO: Get selected menu IDs from your checkboxes
      // For now, we'll use an empty array as placeholder
      permissionData.menuIds = selectedMenuIds;
    } else if (subadmin.permissiontype === "MT5GroupWise") {
      permissionData.groupIds = selectedGroups.map(group => group.id);
    }

    updatePermissions(permissionData);
  };

  // Define the exact order you want categories to appear
  const categoryOrder = [
    { key: 'user', title: 'User Management' },
    { key: 'bonus', title: 'Bonus' },
    { key: 'ib', title: 'IB Management' },
    { key: 'transaction', title: 'Transaction' },
    { key: 'group', title: 'Group Management' },
    { key: 'sales', title: 'Sales Management' },
    { key: 'email', title: 'E-Mail Management' },
    { key: 'news', title: 'News Management' },
    { key: 'notification', title: 'Notification' },
    { key: 'report', title: 'Report Management' },
    { key: 'ticket', title: 'Ticket Management' },
    { key: 'setting', title: 'Setting Management' },
    { key: 'admin', title: 'Sub Admin' }
  ];

  // Handle case where no subadmin data is provided
  if (!subadmin) {
    return (
      <div className="error">
        <h1>Error</h1>
        <p>No subadmin data found. Please navigate from the subadmin list.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="loading">Loading permissions...</div>;
  }

  if (isError) {
    return <div className="error">Error loading permissions: {error.message}</div>;
  }

  if (!data) {
    return <div className="error">No permission data available</div>;
  }

  const inputStyle = {
    backgroundColor: theme === "dark" ? "#000000" : "",
    color: theme === "dark" ? "#ffffff" : "",
    borderColor: theme === "dark" ? "#212529" : ""
  };

  return (
    <div className={`addpermission-wrapper ${theme === "dark" ? "bg-black" : ""}`}>
      <h1>Edit Permission for {subadmin.name}</h1>
      {/* <p>Permission Type: <strong>{subadmin.permissiontype}</strong></p> */}
      
      {categoryOrder.map((category) => {
        // Type-safe access to category data
        const items = data[category.key];
        
        if (!items || items.length === 0) {
          return null;
        }

        return (
          <div key={category.key}>
            <h2 style={{ marginTop: '20px' }}>{category.title}</h2>
            <div className="permission-input">
            {items.map((item) => (
  <label key={item.id} className={`permission-label ${theme === "dark" ? "bg-black" : ""}`}>
    <input 
      className={`form-checkbox ${theme === "dark" ? "dark-mode-placeholder" : ""}`} 
      type="checkbox"
      checked={selectedMenuIds.includes(item.id)}
      onChange={(e) => handleMenuCheckboxChange(item.id, e.target.checked)}
      style={inputStyle}
    />
    <span className="text-gray-400">{item.label}</span>
  </label>
))}
            </div>
          </div>
        );
      })}

      {/* Group Selection Field - Only show for MT5GroupWise subadmins */}
      {subadmin.permissiontype === "MT5GroupWise" && (
        <div style={{ marginTop: '30px', marginBottom: '20px' }}>
          <h2>Group Management</h2>
          <div className="mb-3 position-relative">
            <label className="form-label">
              Select Group(s) <span className="text-danger">*</span>
            </label>

            <div
              className={`form-control d-flex flex-wrap align-items-center gap-2 p-2 position-relative ${theme === "dark" ? "bg-black" : ""}`}
              style={{ minHeight: "42px", border: "1px solid #ced4da", borderRadius: "0.375rem" }}
            >
              {/* Selected groups pills inside the input */}
              {selectedGroups.map((group) => (
                <Badge
                  key={group.id}
                  pill
                  className="d-flex align-items-center px-3 py-2"
                  style={{ fontSize: "0.9rem", background: "var(--primary-gradient)" }}
                >
                  {group.groupName}
                  <button
                    type="button"
                    className="ms-2 btn-close btn-close-white"
                    style={{ fontSize: "0.5rem" }}
                    onClick={() => removeGroup(group.id)}
                    aria-label="Remove"
                  />
                </Badge>
              ))}

              {/* Search input */}
              <input
                type="text"
                placeholder={
                  selectedGroups.length === 0
                    ? isLoadingGroups
                      ? "Loading groups..."
                      : "Start typing group name..."
                    : ""
                }
                value={groupSearchTerm}
                onChange={handleGroupInputChange}
                onFocus={handleGroupInputFocus}
                onBlur={handleGroupInputBlur}
                disabled={isLoadingGroups}
                style={{
                  border: "none",
                  outline: "none",
                  flex: "1",
                  minWidth: "120px",
                  backgroundColor: "transparent",
                  paddingRight: selectedGroups.length > 0 ? "30px" : "0",
                }}
              />

              {/* Clear all icon at the end */}
              {selectedGroups.length > 0 && (
                <button
                  type="button"
                  className="btn-close position-absolute"
                  style={{
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "0.7rem",
                  }}
                  onClick={() => {
                    setSelectedGroups([]);
                  }}
                  aria-label="Clear all selections"
                  title="Clear all selections"
                />
              )}
            </div>

            {groupsError && (
              <Alert variant="danger" className="mt-2">
                Error loading groups: {(groupsError as Error).message}
              </Alert>
            )}

            {showGroupDropdown &&
              filteredGroups &&
              filteredGroups.length > 0 && (
                <div className="client-dropdown">
                  {filteredGroups.map((group: Group) => (
                    <div
                      key={group.id}
                      className={`client-dropdown-item ${theme === "dark" ? "bg-black text-light" : ""}`}
                      onMouseDown={() => handleGroupSelect(group)}
                    >
                      <div style={inputStyle}
                      className={`fw-semibold ${theme === "dark" ? "bg-black text-light" : ""}`}>{group.groupName}</div>
                      <div style={inputStyle} className={`small ${theme === "dark" ? "color-white" : "text-muted"}`}>
                        {group.mt5GroupName}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            {showGroupDropdown &&
              groupSearchTerm &&
              filteredGroups?.length === 0 &&
              !isLoadingGroups && (
                <div className="client-dropdown">
                  <div className="p-2 text-muted">
                    No groups found matching "{groupSearchTerm}"
                  </div>
                </div>
              )}
          </div>
        </div>
      )}

<button 
        onClick={handleSubmit}
        disabled={isSubmitting}
        style={{
          background: 'var(--primary-gradient)',
          border: 'none'
        }}
        className="btn fw-bold px-4 mt-4 text-white"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}

export default Addpermission;