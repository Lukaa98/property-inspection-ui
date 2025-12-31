from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib import colors
from io import BytesIO
from typing import Dict, List

def create_pdf_styles():
    """Define all PDF styles"""
    styles = getSampleStyleSheet()
    
    custom_styles = {
        'name': ParagraphStyle(
            'Name',
            parent=styles['Normal'],
            fontSize=16,
            fontName='Helvetica-Bold',
            alignment=TA_CENTER,
            spaceAfter=6,
            spaceBefore=0
        ),
        'contact': ParagraphStyle(
            'Contact',
            parent=styles['Normal'],
            fontSize=9,
            alignment=TA_CENTER,
            spaceAfter=12,
            spaceBefore=0
        ),
        'section_header': ParagraphStyle(
            'SectionHeader',
            parent=styles['Normal'],
            fontSize=11,
            fontName='Helvetica-Bold',
            spaceAfter=6,
            spaceBefore=10,
        ),
        'job_title': ParagraphStyle(
            'JobTitle',
            parent=styles['Normal'],
            fontSize=10,
            fontName='Helvetica-Bold',
            spaceAfter=2,
            spaceBefore=6
        ),
        'job_header': ParagraphStyle(
            'JobHeader',
            parent=styles['Normal'],
            fontSize=10,
            spaceAfter=4,
            spaceBefore=0
        ),
        'bullet': ParagraphStyle(
            'Bullet',
            parent=styles['Normal'],
            fontSize=10,
            leftIndent=0,
            spaceAfter=3,
            spaceBefore=0,
            leading=12
        ),
        'body_text': ParagraphStyle(
            'BodyText',
            parent=styles['Normal'],
            fontSize=10,
            spaceAfter=4,
            spaceBefore=0,
            leading=12
        ),
    }
    
    return custom_styles


def generate_resume_pdf(resume_data: Dict) -> BytesIO:
    """Generate PDF from structured resume data"""
    buffer = BytesIO()
    
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=0.5*inch,
        bottomMargin=0.5*inch
    )
    
    story = []
    styles = create_pdf_styles()
    blocks = resume_data.get('blocks', [])
    
    for block in blocks:
        block_type = block.get('type')
        
        if block_type == 'contact_info':
            name = block.get('name', '')
            if name:
                story.append(Paragraph(name.upper(), styles['name']))
            
            contact_lines = block.get('lines', [])
            if contact_lines:
                contact_text = ' ● '.join(contact_lines)
                story.append(Paragraph(contact_text, styles['contact']))
        
        elif block_type == 'section_title':
            text = block.get('text', '').upper()
            section_para = Paragraph(f'<b>{text}</b>', styles['section_header'])
            story.append(section_para)
            
            # Underline
            line_table = Table([['']], colWidths=[7*inch])
            line_table.setStyle(TableStyle([
                ('LINEBELOW', (0, 0), (-1, -1), 1, colors.black),
                ('TOPPADDING', (0, 0), (-1, -1), 0),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ]))
            story.append(line_table)
        
        elif block_type == 'experience_group':
            title = block.get('title', '')
            if title:
                story.append(Paragraph(f'<b>{title}</b>', styles['job_title']))
            
            header = block.get('header', '')
            if header:
                story.append(Paragraph(header, styles['job_header']))
            
            bullets = block.get('bullets', [])
            for bullet in bullets:
                bullet_text = f'● {bullet}'
                story.append(Paragraph(bullet_text, styles['bullet']))
            
            story.append(Spacer(1, 0.08*inch))
        
        elif block_type == 'skills_group':
            skills = block.get('skills', [])
            if skills:
                skills_text = ' ● '.join(skills)
                story.append(Paragraph(skills_text, styles['body_text']))
        
        elif block_type == 'education_group':
            degree = block.get('degree', '')
            if degree:
                story.append(Paragraph(degree, styles['body_text']))
            
            details = block.get('details', [])
            for detail in details:
                story.append(Paragraph(detail, styles['body_text']))
            
            story.append(Spacer(1, 0.08*inch))
        
        elif block_type == 'certificates_group':
            certificates = block.get('certificates', [])
            if certificates:
                cert_text = ' | '.join(certificates)
                story.append(Paragraph(f'● {cert_text}', styles['body_text']))
    
    doc.build(story)
    buffer.seek(0)
    return buffer