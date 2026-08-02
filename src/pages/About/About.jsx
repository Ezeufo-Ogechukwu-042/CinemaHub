import React, { useEffect, useState } from 'react';
import { FiAward, FiFilm, FiGlobe, FiUsers } from 'react-icons/fi';
import Avatar from '../../components/Avatar/Avatar';
import { contentService } from '../../services/contentService';
import styles from './About.module.css';

const stats = [
  { icon: FiFilm, value: '50K+', label: 'Movies' },
  { icon: FiUsers, value: '2M+', label: 'Users' },
  { icon: FiAward, value: '150+', label: 'Awards' },
  { icon: FiGlobe, value: '120+', label: 'Countries' },
];

const About = () => {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    loadAbout();
  }, []);

  async function loadAbout() {
    try {
      const page = await contentService.getAboutPage();
      setTeam(page.team || []);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className="container">
          <h1>About CinemaHub</h1>
          <p>Your premier destination for discovering and owning the greatest films ever made.</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.story}>
          <h2>Our Story</h2>
          <p>Founded in 2020, CinemaHub began with a simple mission: to make the world's greatest films accessible to everyone. What started as a small passion project has grown into a global platform serving millions of movie lovers.</p>
        </div>

        <div className={styles.stats}>
          {stats.map((stat, i) => (
            <div key={i} className={styles.stat}>
              <stat.icon className={styles.statIcon} />
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div className={styles.team}>
          <h2>Meet the Team</h2>
          <div className={styles.teamGrid}>
            {team.map((member, i) => (
              <div key={i} className={styles.member}>
                <Avatar src={member.image} alt={member.name} size="large" />
                <h4>{member.name}</h4>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;