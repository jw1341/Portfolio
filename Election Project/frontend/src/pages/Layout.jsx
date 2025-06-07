import { Outlet, Link } from "react-router-dom";
import { hasPermission } from "../utils/usePermission";
import "./Layout.css";

const Layout = () => {
  console.log("role: ", localStorage.getItem('role'));
  return (
    <>
      <nav>
        <p>
          <Link to="/home">Home</Link>
        </p>

        {hasPermission('vote') && (
          <p>
            <Link to="/election">Election</Link>
          </p>
        )}

        {hasPermission('manage_ballots') && (
          <p>
            <Link to="/edit-election">Edit Election</Link>
          </p>
        )}

        <p>
          <Link to="/login">Logout</Link>
        </p>

        {hasPermission('manage_users') && (
          <p>
            <Link to="/create-user">Create User</Link>
          </p>
        )}

        {hasPermission('view_results') && (
          <p>
            <Link to="/election-results">Election Results</Link>
          </p>
        )}

        {hasPermission('manage_societies') && (
          <p>
            <Link to="/create-society">Create Society</Link>
          </p>
        )}
      </nav>

      <Outlet />
    </>
  );
};

export default Layout;
