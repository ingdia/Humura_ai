const pool = require('./src/config/db');
require('dotenv').config();

async function seedData() {
  try {
    console.log('Seeding demo data...');

    // 1. Create Professionals (Users)
    // Dr. Amina Uwase
    const drUwaseRes = await pool.query(`
      INSERT INTO users (name, email, password_hash, role) 
      VALUES ('Dr. Amina Uwase', 'amina@humura.rw', 'hashed_pass', 'PSYCHOLOGIST') 
      RETURNING id
    `);
    const drUwaseId = drUwaseRes.rows[0].id;
    await pool.query(`
      INSERT INTO psychologist_profiles (user_id, bio, specialization) 
      VALUES ($1, 'Clinical Psychologist specializing in depression and anxiety in young women.', 'Depression, Anxiety')
    `, [drUwaseId]);

    // Nurse Grace Nkusi
    const nurseNkusiRes = await pool.query(`
      INSERT INTO users (name, email, password_hash, role) 
      VALUES ('Nurse Grace Nkusi', 'grace@humura.rw', 'hashed_pass', 'PSYCHOLOGIST') 
      RETURNING id
    `);
    const nurseNkusiId = nurseNkusiRes.rows[0].id;
    await pool.query(`
      INSERT INTO psychologist_profiles (user_id, bio, specialization) 
      VALUES ($1, 'SRH nurse with 10 years experience in reproductive health and contraception.', 'Periods, Contraception, Reproductive Health')
    `, [nurseNkusiId]);

    // Jean Mugisha
    const jeanMugishaRes = await pool.query(`
      INSERT INTO users (name, email, password_hash, role) 
      VALUES ('Jean Mugisha', 'jean@humura.rw', 'hashed_pass', 'PSYCHOLOGIST') 
      RETURNING id
    `);
    const jeanMugishaId = jeanMugishaRes.rows[0].id;
    await pool.query(`
      INSERT INTO psychologist_profiles (user_id, bio, specialization) 
      VALUES ($1, 'Community Health Worker dedicated to general youth support.', 'General Youth Support')
    `, [jeanMugishaId]);

    // 2. Create Communities
    const anxietyComm = await pool.query(`
      INSERT INTO communities (name, description, category, professional_id) 
      VALUES ('Anxiety & worry', 'A safe space to discuss fears and pressure.', 'MENTAL_HEALTH', $1) 
      RETURNING id
    `, [drUwaseId]);
    
    const periodComm = await pool.query(`
      INSERT INTO communities (name, description, category, professional_id) 
      VALUES ('Period health', 'Discuss cycles, pain, and health comfortably.', 'SRH', $1) 
      RETURNING id
    `, [nurseNkusiId]);

    const depressionComm = await pool.query(`
      INSERT INTO communities (name, description, category, professional_id) 
      VALUES ('Living with depression', 'Support for those feeling low and unmotivated.', 'MENTAL_HEALTH', $1) 
      RETURNING id
    `, [drUwaseId]);

    // 3. Create Anonymous Users for posts
    const anonSarah = await pool.query("INSERT INTO users (is_anonymous) VALUES (true) RETURNING id");
    const anonDavid = await pool.query("INSERT INTO users (is_anonymous) VALUES (true) RETURNING id");

    // 4. Seed Posts
    await pool.query(`
      INSERT INTO community_posts (community_id, user_id, content, tag) 
      VALUES ($1, $2, 'I can''t sleep. I keep thinking about failing school and disappointing my family. Does anyone else feel this way?', '#anxiety')
    `, [anxietyComm.rows[0].id, anonDavid.rows[0].id]);

    await pool.query(`
      INSERT INTO community_posts (community_id, user_id, content, tag) 
      VALUES ($1, $2, 'My period has been irregular for 3 months. I am scared but too embarrassed to ask anyone.', '#periods')
    `, [periodComm.rows[0].id, anonSarah.rows[0].id]);

    // 5. Seed Q&As
    const q1 = await pool.query(`
      INSERT INTO anonymous_questions (user_id, professional_id, category, question_text, answer_text, is_answered, answered_at) 
      VALUES ($1, $2, 'SRH', 'I missed my period and I am scared. I don''t know who to tell.', 
      'First — breathe. Missing one period can happen for many reasons including stress, diet changes, or illness. It does not always mean pregnancy. Here is what I want you to know and what your options are...', true, CURRENT_TIMESTAMP)
    `, [anonSarah.rows[0].id, nurseNkusiId]);

    // 6. Seed Courses
    const course1 = await pool.query(`
      INSERT INTO courses (title, description, category, verified_by) 
      VALUES ('Understanding anxiety', 'Learn the signs and management techniques.', 'MENTAL_HEALTH', 'Dr. Amina Uwase') 
      RETURNING id
    `);
    await pool.query(`
      INSERT INTO lessons (course_id, title, content, order_index) 
      VALUES ($1, 'What is Anxiety?', 'Anxiety is your body''s natural response to stress...', 1)
    `, [course1.rows[0].id]);

    // 7. Seed Health Centers
    await pool.query(`
      INSERT INTO health_centers (name, type, address, note) 
      VALUES ('Kacyiru Isange One Stop Centre', 'Isange One Stop Centre', 'Kacyiru, Kigali', 'Girls aged 15+ can visit without parental consent under Rwanda''s 2025 SRH law')
    `);

    console.log('Demo data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await pool.end();
  }
}

seedData();
