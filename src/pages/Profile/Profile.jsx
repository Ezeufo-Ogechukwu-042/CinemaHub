import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader/Loader";
import {
  FiUser,
  FiHeart,
  FiShoppingBag,
  FiEye,
  FiSettings,
  FiLogOut,
  FiMail,
  FiCalendar,
  FiShield,
  FiAward,
  FiClock,
  FiEdit,
  FiCamera,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import styles from "./Profile.module.css";

import Avatar from "../../components/Avatar/Avatar";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";

import { useWishlist } from "../../context/WishlistContext";

import { authService } from "../../services/authService";
import { profileService } from "../../services/profileService";

const Profile = () => {
  const navigate = useNavigate();
  const { wishlist } = useWishlist();

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);

  const [profile, setProfile] = useState(null);

  const [activeSection, setActiveSection] = useState("profile");

  const [editing, setEditing] = useState(false);

const [fullName, setFullName] = useState("");

const [avatar, setAvatar] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
        await profileService.updateProfile(user.id, {
            full_name: fullName,
            avatar,
        });

        await loadProfile();

        setEditing(false);

    } catch (err) {
        console.error(err);
    }
  };

const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
        const imageUrl = await profileService.uploadAvatar(
            user.id,
            file
        );

        setAvatar(imageUrl);

    } catch (err) {
        console.error(err);
    }
  }; 


  async function loadProfile() {
    try {
      setLoading(true);

      const currentUser = await authService.getCurrentUser();

      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);

      let userProfile = await profileService.getProfile(currentUser.id);

      if (!userProfile) {
        userProfile = await profileService.ensureProfile(currentUser);
      }

      setProfile(userProfile);
      setFullName(userProfile.full_name || "");
      setAvatar(userProfile.avatar || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await authService.logout();
    navigate("/login");
  }

  if (loading) {
    return (
      
        <Loader size="large" />
    
    );
  }

  const initials =
    profile?.full_name
      ?.split(" ")
      ?.map((n) => n[0])
      ?.join("")
      ?.slice(0, 2)
      ?.toUpperCase() ||
    user.email[0].toUpperCase();

      return (
    <div className={styles.page}>
      <div className="container">

        {/* ================= HEADER ================= */}

        <div className={styles.header}>

          <div className={styles.avatarWrapper}>

            <Avatar
              size="xlarge"
              src={profile?.avatar}
              fallback={initials}
            />

            <label className={styles.editAvatar}>
              <FiCamera />

              <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatarUpload}
              />
          </label>

          </div>

          <div className={styles.headerInfo}>

            <div className={styles.nameRow}>
              <h1>{profile?.full_name || "CinemaHub User"}</h1>

              <button
                  className={styles.editBtn}
                  onClick={() => setEditing(!editing)}
              >
                  <FiEdit />

                  {editing ? "Cancel" : "Edit"}
              </button>

              {editing && (
                  <button
                      className={styles.saveBtn}
                      onClick={handleSave}
                  >
                      Save Changes
                  </button>
              )}

            </div>

            <p>{user.email}</p>

            <span className={styles.member}>
              Member since{" "}
              {new Date(user.created_at).toLocaleDateString()}
            </span>

            <div className={styles.badges}>

              <span className={styles.verified}>
                <FiShield />
                Verified
              </span>

              <span className={styles.plan}>
                {profile?.role || "User"}
              </span>

            </div>

          </div>

        </div>

        {/* ================= STATS ================= */}

        <div className={styles.stats}>

          <div className={styles.statCard}>
            <FiHeart />
            <h2>{wishlist.length}</h2>
            <span>Wishlist</span>
          </div>

          <div className={styles.statCard}>
            <FiShoppingBag />
            <h2>0</h2>
            <span>Purchases</span>
          </div>

          <div className={styles.statCard}>
            <FiAward />
            <h2>0</h2>
            <span>Reviews</span>
          </div>

          <div className={styles.statCard}>
            <FiEye />
            <h2>0</h2>
            <span>Recently Watched</span>
          </div>

        </div>

        {/* ================= BODY ================= */}

        <div className={styles.grid}>

          {/* ================= SIDEBAR ================= */}

          <aside className={styles.sidebar}>

            <nav className={styles.nav}>

              <button
                onClick={() => setActiveSection("profile")}
                className={`${styles.navItem} ${
                  activeSection === "profile" ? styles.active : ""
                }`}
              >
                <FiUser />
                Personal Info
              </button>

              <button
                onClick={() => setActiveSection("orders")}
                className={`${styles.navItem} ${
                  activeSection === "orders" ? styles.active : ""
                }`}
              >
                <FiShoppingBag />
                Purchases
              </button>

              <button
                onClick={() => setActiveSection("wishlist")}
                className={`${styles.navItem} ${
                  activeSection === "wishlist" ? styles.active : ""
                }`}
              >
                <FiHeart />
                Wishlist ({wishlist.length})
              </button>

              <button
                onClick={() => setActiveSection("activity")}
                className={`${styles.navItem} ${
                  activeSection === "activity" ? styles.active : ""
                }`}
              >
                <FiClock />
                Activity
              </button>

              <button
                onClick={() => setActiveSection("settings")}
                className={`${styles.navItem} ${
                  activeSection === "settings" ? styles.active : ""
                }`}
              >
                <FiSettings />
                Settings
              </button>

            </nav>

          </aside>

          {/* ================= CONTENT ================= */}

          <main className={styles.content}>

            {activeSection === "profile" && (

              <>
                <div className={styles.card}>

                  <h2>Account Information</h2>

                  <div className={styles.form}>

                    <div className={styles.field}>
                      <label>Full Name</label>
                      <input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          readOnly={!editing}
                      />
                    </div>

                    <div className={styles.field}>
                      <label>Email Address</label>
                      <input
                        value={user.email}
                        readOnly
                      />
                    </div>

                    <div className={styles.field}>
                      <label>User ID</label>
                      <input
                        value={user.id}
                        readOnly
                      />
                    </div>

                    <div className={styles.field}>
                      <label>Role</label>
                      <input
                        value={profile?.role || "User"}
                        readOnly
                      />
                    </div>

                  </div>

                </div>
                                <div className={styles.card}>

                  <h2>Account Status</h2>

                  <div className={styles.statusGrid}>

                    <div>
                      <FiShield />
                      <span>Status</span>
                      <strong className={styles.online}>Active</strong>
                    </div>

                    <div>
                      <FiAward />
                      <span>Membership</span>
                      <strong>Free Plan</strong>
                    </div>

                    <div>
                      <FiCalendar />
                      <span>Joined</span>
                      <strong>
                        {new Date(user.created_at).toLocaleDateString()}
                      </strong>
                    </div>

                    <div>
                      <FiMail />
                      <span>Email</span>
                      <strong>
                        {user.email_confirmed_at
                          ? "Verified"
                          : "Pending"}
                      </strong>
                    </div>

                  </div>

                </div>
              </>
            )}

            {activeSection === "wishlist" && (
              <div className={styles.card}>
                <h2>My Wishlist</h2>

                {wishlist.length === 0 ? (
                  <div className={styles.emptyState}>
                    <FiHeart className={styles.emptyIcon} />
                    <h3>Your wishlist is empty</h3>
                    <p>
                      Movies you save will appear here.
                    </p>
                  </div>
                ) : (
                  <div className={styles.wishlistInfo}>
                    <h3>{wishlist.length} Movies Saved</h3>
                    <p>
                      Visit the Wishlist page to manage your saved
                      movies.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeSection === "orders" && (
              <div className={styles.card}>
                <h2>Purchase History</h2>

                <div className={styles.emptyState}>
                  <FiShoppingBag className={styles.emptyIcon} />

                  <h3>No purchases yet</h3>

                  <p>
                    Movies you purchase will appear here.
                  </p>
                </div>
              </div>
            )}

            {activeSection === "activity" && (
              <div className={styles.card}>
                <h2>Recent Activity</h2>

                <div className={styles.emptyState}>
                  <FiClock className={styles.emptyIcon} />

                  <h3>No recent activity</h3>

                  <p>
                    Your recently viewed movies will appear here.
                  </p>
                </div>
              </div>
            )}

            {activeSection === "settings" && (
              <>
                <div className={styles.card}>

                  <div className={styles.preference}>

                    <div>
                      <h3>Appearance</h3>

                      <p>
                        Switch between light and dark mode.
                      </p>
                    </div>

                    <ThemeToggle />

                  </div>

                </div>

                <div className={styles.card}>

                  <h2>Account Information</h2>

                  <div className={styles.statusGrid}>

                    <div>
                      <span>User Role</span>
                      <strong>{profile?.role || "User"}</strong>
                    </div>

                    <div>
                      <span>Wishlist</span>
                      <strong>{wishlist.length} Movies</strong>
                    </div>

                    <div>
                      <span>Account</span>
                      <strong>Active</strong>
                    </div>

                    <div>
                      <span>Plan</span>
                      <strong>Free</strong>
                    </div>

                  </div>

                </div>

                <div className={styles.dangerZone}>

                  <h2>Danger Zone</h2>

                  <p>
                    Logging out will end your current session on
                    this device.
                  </p>

                  <button
                    onClick={handleLogout}
                    className={styles.logoutBtn}
                  >
                    <FiLogOut />
                    Logout
                  </button>

                </div>
              </>
            )}
            
          </main>

        </div>

      </div>

    </div>
  );
};

export default Profile;