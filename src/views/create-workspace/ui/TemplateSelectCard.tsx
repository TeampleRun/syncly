// 템플릿 선택 카드 — 클릭 시 해당 purpose로 생성 Dialog를 연다
import {
  WORKSPACE_PURPOSE_META,
  WORKSPACE_TEMPLATE_DETAIL,
  type WorkspacePurpose,
} from '@/entities/workspace';

interface TemplateSelectCardProps {
  purpose: WorkspacePurpose;
  onSelect: (purpose: WorkspacePurpose) => void;
}

export default function TemplateSelectCard({ purpose, onSelect }: TemplateSelectCardProps) {
  const meta = WORKSPACE_PURPOSE_META[purpose];
  const detail = WORKSPACE_TEMPLATE_DETAIL[purpose];
  const PurposeIcon = meta.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(purpose)}
      style={{ borderColor: detail.borderColor }}
      className="flex w-full flex-col gap-3 rounded-[16px] border-2 bg-white p-6.5 text-left transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-3.75">
        <div
          className="flex size-11.25 shrink-0 items-center justify-center rounded-[13px] shadow-[0px_3px_3px_rgba(0,0,0,0.1)]"
          style={{ backgroundImage: meta.gradient }}
        >
          <PurposeIcon className="size-[22.5px] text-white" aria-hidden />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-brand-ink text-lg leading-7 font-bold">{meta.label}</span>
          <p className="text-brand-muted text-[13px] leading-4">{detail.subtitle}</p>
        </div>
      </div>
      <p className="text-brand-muted text-sm leading-[22.75px]">{detail.description}</p>
      <div className="flex flex-wrap gap-2.5">
        {detail.tags.map((tag) => (
          <span
            key={tag}
            style={{ backgroundColor: detail.tagBg, color: detail.tagText }}
            className="rounded-full px-2 py-0.5 text-[13px] leading-4 font-semibold tracking-[-0.325px]"
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}
