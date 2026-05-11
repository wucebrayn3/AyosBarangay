from io import BytesIO
from django.utils import timezone
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image,
)
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from pathlib import Path


def generate_report_pdf(infra_issues, concerns, purok_data=None):
    buf = BytesIO()
    doc = SimpleDocTemplate(
        buf, pagesize=landscape(A4),
        leftMargin=15*mm, rightMargin=15*mm,
        topMargin=15*mm, bottomMargin=15*mm,
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "Title2", parent=styles["Title"],
        fontSize=20, spaceAfter=4*mm,
    )
    subtitle_style = ParagraphStyle(
        "Subtitle2", parent=styles["Normal"],
        fontSize=10, textColor=colors.grey,
        spaceAfter=8*mm, alignment=TA_CENTER,
    )
    header_style = ParagraphStyle(
        "Header2", parent=styles["Heading2"],
        fontSize=13, spaceAfter=4*mm, spaceBefore=6*mm,
    )
    small_style = ParagraphStyle(
        "Small2", parent=styles["Normal"],
        fontSize=8, leading=10,
    )

    elements = []

    # Title
    elements.append(Paragraph("AyosBarangay — Report Export", title_style))
    elements.append(
        Paragraph(
            f"Generated: {timezone.now().strftime('%B %d, %Y at %I:%M %p')}",
            subtitle_style,
        )
    )

    # Summary
    all_items = (
        [("Infrastructure", i) for i in infra_issues]
        + [("Concern", c) for c in concerns]
    )
    total = len(all_items)
    pending = sum(1 for _, i in all_items if i.status == "pending")
    verified = sum(1 for _, i in all_items if i.status == "verified")
    in_progress = sum(1 for _, i in all_items if i.status == "in_progress")
    resolved = sum(1 for _, i in all_items if i.status == "resolved")

    elements.append(Paragraph("Summary", header_style))
    summary_data = [
        ["Total Reports", "Pending", "Verified", "In Progress", "Resolved"],
        [str(total), str(pending), str(verified), str(in_progress), str(resolved)],
    ]
    summary_table = Table(summary_data, colWidths=[60*mm, 40*mm, 40*mm, 40*mm, 40*mm])
    summary_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1e3a5f")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTSIZE", (0, 0), (-1, -1), 11),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("ROWBACKGROUNDS", (0, 1), (-1, 1), [colors.HexColor("#f4f7fb"), colors.white]),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    elements.append(summary_table)
    elements.append(Spacer(1, 6*mm))

    # Detailed report table
    elements.append(Paragraph("All Reports", header_style))

    detail_header = ["Ref #", "Type", "Title", "Category", "Status", "Purok", "Date", "Reporter"]
    detail_rows = [detail_header]

    for kind, item in all_items:
        ref = f"{'INF' if kind == 'Infrastructure' else 'CON'}-{str(item.id).zfill(4)}"
        purok_name = getattr(getattr(item, "purok", None), "name", "") or ""
        reporter_name = ""
        if getattr(item, "reporter", None):
            reporter_name = f"{item.reporter.first_name} {item.reporter.last_name}" or item.reporter.username
        detail_rows.append([
            ref,
            kind,
            item.title[:60],
            (getattr(item, "category", "") or "").replace("_", " ").title(),
            item.status.replace("_", " ").title(),
            purok_name,
            (item.created_at.strftime("%Y-%m-%d") if item.created_at else ""),
            reporter_name or "Anonymous",
        ])

    col_widths = [22*mm, 22*mm, 55*mm, 28*mm, 28*mm, 25*mm, 25*mm, 30*mm]
    detail_table = Table(detail_rows, colWidths=col_widths, repeatRows=1)
    detail_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1e3a5f")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTSIZE", (0, 0), (-1, 0), 8),
        ("FONTSIZE", (0, 1), (-1, -1), 7),
        ("ALIGN", (0, 0), (-1, 0), "CENTER"),
        ("ALIGN", (0, 1), (1, -1), "CENTER"),
        ("ALIGN", (4, 1), (6, -1), "CENTER"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#d0d5dd")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f9fafb")]),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    elements.append(detail_table)

    # Footer
    elements.append(Spacer(1, 8*mm))
    footer_style = ParagraphStyle(
        "Footer2", parent=styles["Normal"],
        fontSize=7, textColor=colors.grey,
        alignment=TA_CENTER,
    )
    elements.append(
        Paragraph(
            f"AyosBarangay Community Tracker — {timezone.now().strftime('%Y-%m-%d %H:%M')}",
            footer_style,
        )
    )

    doc.build(elements)
    buf.seek(0)
    return buf
