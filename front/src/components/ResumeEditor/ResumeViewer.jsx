import { Paper } from '@mui/material';
import {
  ContactInfoSection,
  SectionHeader,
  ExperienceSection,
  SkillsSection,
  EducationSection,
  CertificatesSection,
} from '../ResumeSections';

export function ResumeViewer({ items, updateItem, deleteItem, openReplaceDialog }) {
  return (
    <Paper
      elevation={3}
      sx={{
        width: '8.5in',
        minHeight: '11in',
        p: '0.75in',
        mx: 'auto',
        bgcolor: 'white',
        fontFamily: '"Times New Roman", serif',
        fontSize: '11pt',
      }}
    >
      {items.map((item) => {
        switch (item.type) {
          case 'contact_info':
            return (
              <ContactInfoSection
                key={item.id}
                info={item}
                onChange={(field, value, idx) => updateItem(item.id, field, value, idx)}
                onDelete={() => deleteItem(item.id)}
              />
            );

          case 'section_title':
            return <SectionHeader key={item.id} text={item.text} />;

          case 'experience_group':
            return (
              <ExperienceSection
                key={item.id}
                experience={item}
                onChange={(field, value, idx) => updateItem(item.id, field, value, idx)}
                onDelete={() => deleteItem(item.id)}
                onReplace={() => openReplaceDialog(item.id)}
              />
            );

          case 'skills_group':
            return (
              <SkillsSection
                key={item.id}
                skills={item}
                onChange={(field, value, idx) => updateItem(item.id, field, value, idx)}
              />
            );

          case 'education_group':
            return (
              <EducationSection
                key={item.id}
                education={item}
                onChange={(field, value) => updateItem(item.id, field, value)}
                onDelete={() => deleteItem(item.id)}
              />
            );

          case 'certificates_group':
            return (
              <CertificatesSection
                key={item.id}
                certificates={item}
                onChange={(field, value, idx) => updateItem(item.id, field, value, idx)}
              />
            );

          default:
            return null;
        }
      })}
    </Paper>
  );
}