import React from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import Select, { components } from 'react-select';
import { connect } from 'react-redux';
import jwt from 'jsonwebtoken';
import { getLanguages, addTalentLanguage } from '../../actions/language';
import { getAccents, addTalentAccent } from '../../actions/accent';
import { getVoiceSamples } from '../../actions/getVoiceSamples';
import { getTalent } from '../../actions';
import { addTalentBio } from '../../actions/talentBio';
import makeAnimated from 'react-select/animated';
import TalentProfileSample from './TalentProfileSample';
import VoiceSample from './VoiceSample';
import 'bootstrap/dist/css/bootstrap.css';
import '../../styles/talent-profile.css';
import goldMic from '../../images/Gold-Mic.png';
import silverMic from '../../images/Silver-Mic.png';
import bronzeMic from '../../images/Bronze-Mic.png';

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
];

const ageOptions = [
  { value: 'child', label: 'Child' },
  { value: 'teen', label: 'Teen' },
  { value: 'adult', label: 'Adult' },
  { value: 'senior', label: 'Senior' }
];

class TalentProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: jwt.decode(localStorage.getItem('token')).userId,
      talent: {},
      voiceGender: '',
      voiceAge: '',
      languageOptions: [],
      accentOptions: [],
      languages: [],
      accents: [],
      biography: '',
      voiceSamples: []
    };
  }

  //On Mount, lang/accents are pulled from back-end and added to store, then
  //modified to a format that the form fields can use and put into state
  componentDidMount() {
    this.props.getTalent(this.state.userId).then(res => this.setState({talent: this.props.talent[0]}))
    this.props.getLanguages().then(this.modifyLanguage);
    this.props.getAccents().then(this.modifyAccents);
    this.props.getVoiceSamples(jwt.decode(localStorage.getItem('token')).userId)
  }

  refreshSamples = () => {
    return this.props.getVoiceSamples(jwt.decode(localStorage.getItem('token')).userId)
  }

  modifyLanguage = () => {
    const newArray = this.props.languageOptions.map(item => ({
      value: item.language,
      label: item.language,
      languageId: item.languageId
    }));

    this.setState({ languageOptions: newArray });
  };

  modifyAccents = () => {
    const newArray = this.props.accentOptions.map(item => ({
      value: item.accent,
      label: item.accent,
      accentId: item.accentId
    }));
    this.setState({ accentOptions: newArray });
  };

  submitTalentLanguages = talentLangArray => {
    talentLangArray.forEach(newLang => {
      const langSubmit = {
        userId: this.state.userId,
        languageId: newLang.languageId
      };
      this.props.addTalentLanguage(langSubmit);
    });
  };

  submitTalentAccents = talentAccentArray => {
    talentAccentArray.forEach(newAccent => {
      const accentSubmit = {
        userId: this.state.userId,
        accentId: newAccent.accentId
      };
      this.props.addTalentAccent(accentSubmit);
    });
  };

  submitChanges = (voiceGender, voiceAge, biography) => {
    let talent = this.props.talent[0];
    const bioSubmit = {
      talentId: talent.talentId,
      voiceGender: voiceGender.length > 0 ? voiceGender : talent.voiceGender,
      voiceAge: voiceAge.length > 0 ? voiceAge : talent.voiceAge,
      biography: biography.length > 0 ? biography : talent.biography
    };
    this.props.addTalentBio(bioSubmit);
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleAgeChange = voiceAge => {
    this.setState({ voiceAge: voiceAge.value });
  };

  handleGenderChange = voiceGender => {
    this.setState({ voiceGender: voiceGender.value });
  };

  handleLanguageAdd = languageId => {
    const newLang = {
      userId: this.state.userId,
      languageId: languageId
    };
  };

  handleLanguageChange = languages => {
    if (languages === null) {
      languages = [];
    } else {
      this.setState({ languages });
    }
  };

  handleAccentChange = accents => {
    this.setState({ accents });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.submitTalentLanguages(this.state.languages);
    this.submitTalentAccents(this.state.accents);
    this.submitChanges(
      this.state.voiceGender,
      this.state.voiceAge,
      this.state.biography
    );
  };

  loyaltyLevel = level => {
    if(level === 1) {
        return <img className="loyaltyBadge" src={bronzeMic} alt="bronze-mic" />
    } else if (level === 2) {
        return <img className="loyaltyBadge" src={silverMic} alt="silver-mic" />
    } else if (level ===3) {
        return <img className="loyaltyBadge" src={goldMic} alt="gold-mic" />
    }
}

  render() {
    return (
      <div style={{ marginTop: '21vh' }} className="TalentProfile">
        <h1 className="title">TALENT PROFILE</h1>
        {this.loyaltyLevel(this.state.talent.loyaltyLevel)}
        <Form className="ProfileForm">
          <FormGroup tag="fieldset">
            <Label for="genderSelect">Select Voice Gender</Label>
            <Select
              className="mt-0 mb-3 col-md-11 col-offset-4"
              onChange={this.handleGenderChange}
              components={makeAnimated()}
              options={genderOptions}
            />
          </FormGroup>
          <FormGroup>
            <Label for="voiceAgeSelect">Select Voice Age</Label>
            <Select
              className="mt-0 mb-3 col-md-11 col-offset-4"
              onChange={this.handleAgeChange}
              components={makeAnimated()}
              options={ageOptions}
            />
          </FormGroup>
          <FormGroup>
            <Label for="languageSelect">Select Languages</Label>
            <Select
              className="mt-0 mb-3 col-md-11 col-offset-4"
              onChange={this.handleLanguageChange}
              components={makeAnimated()}
              isMulti
              options={this.state.languageOptions}
            />
          </FormGroup>
          <FormGroup>
            <Label for="accentSelect">Select Accents</Label>
            <Select
              className="mt-0 mb-3 col-md-11 col-offset-4"
              onChange={this.handleAccentChange}
              components={makeAnimated()}
              isMulti
              options={this.state.accentOptions}
            />
          </FormGroup>
          <FormGroup className="bioForm">
            <Label for="bioText">Bio (Tell us a bit about yourself)</Label>
            <Input
              className="mt-0 mb-3 ml-3 col-md-11 col-offset-4"
              type="textarea"
              name="biography"
              id="bioText"
              onChange={this.handleChange}
            />
          </FormGroup>
          <Button
            // onClick={this.handleSubmit}
            outline
            size="lg"
            className="saveButton"
          >
            Save Profile
          </Button>
          <TalentProfileSample refreshSamples={this.refreshSamples} userId={this.state.userId} />

          <div className="sampleDiv">
            <h2>Voice Samples</h2>
            { this.props.voiceSamples.map(sample => <VoiceSample sample={sample} />) }
          </div>

        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  languageOptions: state.languageReducer.languages,
  accentOptions: state.accentReducer.accents,
  talent: state.getTalentReducer.talent,
  voiceSamples: state.getVoiceSamplesReducer.samples
});

export default connect(mapStateToProps, {
  getAccents,
  getLanguages,
  getTalent,
  addTalentAccent,
  addTalentLanguage,
  addTalentBio,
  getVoiceSamples
})(TalentProfile);
