import Image from 'next/image';

// 참여 중인 워크스페이스가 없을 때의 빈 상태
export default function EmptyWorkspaces() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3.75 py-20">
      <Image
        src="/workspaces/empty-workspace.png"
        alt=""
        width={147}
        height={88}
        className="pointer-events-none opacity-[0.56] select-none"
      />
      <h2 className="text-brand-ink text-2xl leading-8 font-bold tracking-normal">
        아직 워크스페이스가 없어요
      </h2>
      <p className="text-brand-muted text-center text-base leading-6 tracking-normal">
        팀과 함께 사용할 워크스페이스를 만들어
        <br />
        프로젝트를 효율적으로 관리해보세요.
      </p>
    </div>
  );
}
