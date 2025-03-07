import React, { useState, useEffect } from 'react';
import './Survey.css';

const LANGUAGE = {
  en: {
    navbarTitle: 'Community Feedback Survey',
    ageQuestion: 'What is your age group?',
    ageOptions: ['Under 18', '18-34', '35-54', '55-74', '75+'],
    languageQuestion: 'What language would you be most comfortable in, if you struggle to understand the website (If Any)?',
    understandQuestion: 'How easy is it for you to understand the instructions on this website? (1 = Very Difficult, 5 = Very Easy)',
    physicalQuestion: 'Do you have any challenges that might make it harder to navigate this website?',
    physicalOptions: ['Vision impairment', 'Hearing impairment', 'Limited movement', 'Limited website understanding', 'None'],
    navigationQuestion: 'Which part of this website do you find the most challenging to navigate?',
    navigationOptions: ['Basketball Game', 'Website Search', 'This Survey'],
    difficultiesQuestion: 'Please describe any other difficulties you face while navigating this website.',
    suggestionsQuestion: 'What suggestions do you have to improve accessibility for users, especially for elderly users?',
    submitButton: 'Submit Survey',
    thankYou: 'Thank you for your feedback!',
    languages: {
      en: 'English',
      zh: '简体中文',
      ms: 'Bahasa Malaysia',
      others: 'Others'
    }
  },
  zh: {
    navbarTitle: '社区反馈调查',
    ageQuestion: '您的年龄组别是？',
    ageOptions: ['18岁以下', '18-34岁', '35-54岁', '55-74岁', '75岁以上'],
    languageQuestion: '如果您在理解本网站内容时有困难，您最习惯使用哪种语言？',
    understandQuestion: '您觉得本网站上的指示容易理解吗？(1 = 非常困难, 5 = 非常容易)',
    physicalQuestion: '您是否有任何障碍可能使您更难浏览本网站？',
    physicalOptions: ['视力障碍', '听力障碍', '行动不便', '对网站内容理解有限', '无'],
    navigationQuestion: '您觉得本网站哪个部分最难浏览？',
    navigationOptions: ['篮球比赛', '网站搜索', '本调查'],
    difficultiesQuestion: '请描述您在浏览本网站时遇到的其他困难。',
    suggestionsQuestion: '您对改进网站可访问性，特别是对老年用户，有什么建议？',
    submitButton: '提交调查',
    thankYou: '感谢您的反馈！',
    languages: {
      en: 'English',
      zh: '简体中文',
      ms: 'Bahasa Malaysia',

    }
  },
  ms: {
    navbarTitle: 'Tinjauan',
    ageQuestion: 'Apakah kumpulan umur anda?',
    ageOptions: ['Bawah 18', '18-34', '35-54', '55-74', '75+'],
    languageQuestion: 'Apakah bahasa yang anda paling selesa digunakan jika anda sukar memahami laman web ini (Jika ada)?',
    understandQuestion: 'Adakah sukar untuk anda memahami arahan di laman web ini? (1 = Sangat Sukar, 5 = Sangat Mudah)',
    physicalQuestion: 'Adakah anda mempunyai sebarang cabaran yang mungkin menyukarkan anda untuk melayari laman web ini?',
    physicalOptions: ['Masalah penglihatan', 'Masalah pendengaran', 'Pergerakan terhad', 'Pemahaman laman web terhad', 'Tiada'],
    navigationQuestion: 'Bahagian apa dalam laman web ini yang anda rasa paling sukar untuk dilayari?',
    navigationOptions: ['Permainan Bola Keranjang', 'Pencarian Laman Web', 'Kajian Ini'],
    difficultiesQuestion: 'Sila terangkan kesukaran lain yang anda hadapi semasa melayari laman web ini.',
    suggestionsQuestion: 'Apakah cadangan anda untuk meningkatkan kebolehaksesan laman web ini, terutama untuk pengguna warga emas?',
    submitButton: 'Hantar Tinjauan',
    thankYou: 'Terima kasih atas maklum balas anda!',
    languages: {
      en: 'English',
      zh: '简体中文',
      ms: 'Bahasa Malaysia',
    }
  }
};

const QUESTIONS = [
  { 
    id: 'age',
    type: 'multiple-choice',
    questionKey:"ageQuestion",
    optionsKey: 'ageOptions'
  },
  { 
    id: 'language-proficiency',
    type: 'multiple-choice',
    options: ['en', 'zh', 'ms']
  },
  {
    id: 'understand-instructions',
    type: 'scale',
    questionKey: 'understandQuestion',
    scale: 5
  },
  {
    id: 'physical-condition',
    type: 'multiple-choice',
    questionKey: 'physicalQuestion',
    optionsKey: 'physicalOptions',
    multiple: true
  },
  {
    id: 'navigation-challenge',
    type: 'multiple-choice',
    questionKey: 'navigationQuestion',
    optionsKey: 'navigationOptions'
  },
  {
    id: 'difficulties',
    type: 'text',
    questionKey: 'difficultiesQuestion'
  },
];

const Survey = () => {
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    if (responses['language-proficiency']) {
      setSelectedLanguage(responses['language-proficiency']);
    }
  }, [responses['language-proficiency']]);

  const handleResponse = (questionId, value) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const getQuestionText = (question) => {
    if (question.id === 'language-proficiency') return LANGUAGE[selectedLanguage].languageQuestion;
    return LANGUAGE[selectedLanguage][question.questionKey || question.id];
  };

  const renderQuestion = (question) => {
    const currentLang = LANGUAGE[selectedLanguage];
    
    switch(question.type) {
      case 'multiple-choice':
        return (
          <div className="options-grid">
            {(question.options || currentLang[question.optionsKey]).map(option => (
              <label key={option} className="option-card">
                <input
                  type={question.multiple ? 'checkbox' : 'radio'}
                  name={question.id}
                  value={option}
                  onChange={(e) => {
                    const newValue = question.multiple
                      ? [...(responses[question.id] || []), option]
                      : option;
                    handleResponse(question.id, newValue);
                  }}
                />
                <span className="option-text">
                  {question.id === 'language-proficiency'
                    ? currentLang.languages[option]
                    : currentLang[question.optionsKey]
                      ? currentLang[question.optionsKey].find(o => o === option)
                      : option}
                </span>
              </label>
            ))}
          </div>
        );

      case 'scale':
        return (
          <div className="scale-container">
            {[...Array(question.scale)].map((_, i) => (
              <label key={i} className="scale-label">
                <input
                  type="radio"
                  name={question.id}
                  value={i+1}
                  onChange={(e) => handleResponse(question.id, e.target.value)}
                />
                <span className="scale-number">{i+1}</span>
              </label>
            ))}
          </div>
        );

      case 'text':
        return (
          <textarea
            className="text-response"
            rows="4"
            onChange={(e) => handleResponse(question.id, e.target.value)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="container">
      <nav className="navbar">
        <h1>{LANGUAGE[selectedLanguage].navbarTitle}</h1>
      </nav>

      {!submitted ? (
        <form className="section" onSubmit={handleSubmit}>
          {QUESTIONS.map((question, index) => (
            <div key={question.id} className="section-item question-item">
              <div className="question-header">
                <span className="question-number">Q{index + 1}</span>
                <h3>{getQuestionText(question)}</h3>
              </div>
              {renderQuestion(question)}
            </div>
          ))}
          <button type="submit" className="submit-button">
            {LANGUAGE[selectedLanguage].submitButton}
          </button>
        </form>
      ) : (
        <div className="task-completed">
          <h2>{LANGUAGE[selectedLanguage].thankYou}</h2>
        </div>
      )}
    </div>
  );
};

export default Survey;