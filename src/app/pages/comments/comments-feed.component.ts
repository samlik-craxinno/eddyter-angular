import { Component, signal } from '@angular/core';
import { FAKE_POSTS } from '../../core/comments/feed-posts';
import type { LifecyclePhase } from '../../core/lifecycle/lifecycle.types';
import { ReplyEditorComponent } from './reply-editor/reply-editor.component';

@Component({
  selector: 'app-comments-feed',
  imports: [ReplyEditorComponent],
  templateUrl: './comments-feed.component.html',
  styleUrl: './comments-feed.component.css',
})
export class CommentsFeedComponent {
  protected readonly posts = FAKE_POSTS;

  protected readonly activeReplies = signal<string[]>([]);
  protected readonly mountCount = signal(0);
  protected readonly destroyCount = signal(0);
  protected readonly logs = signal<string[]>([]);

  protected isReplyOpen(postId: string): boolean {
    return this.activeReplies().includes(postId);
  }

  protected openReply(postId: string): void {
    if (this.isReplyOpen(postId)) return;
    this.activeReplies.update((ids) => [...ids, postId]);
    this.pushLog(`[Feed] open reply editor for ${postId}`);
  }

  protected cancelReply(postId: string): void {
    this.activeReplies.update((ids) => ids.filter((id) => id !== postId));
    this.pushLog(`[Feed] cancel — destroying editor for ${postId}`);
  }

  protected onHostLifecycle(event: 'mounted' | 'destroyed', postId: string): void {
    if (event === 'mounted') {
      this.mountCount.update((n) => n + 1);
      this.pushLog(
        `[Feed] ReplyEditor mounted (${postId}) — total: ${this.mountCount()}`,
      );
    } else {
      this.destroyCount.update((n) => n + 1);
      this.pushLog(
        `[Feed] ReplyEditor destroyed (${postId}) — total: ${this.destroyCount()}`,
      );
    }
  }

  protected onEditorLifecycle(
    postId: string,
    event: { phase: LifecyclePhase; detail?: string },
  ): void {
    const { phase, detail } = event;
    if (detail === undefined) {
      this.pushLog(`[Feed] ${postId} → ${phase}`);
    } else {
      this.pushLog(`[Feed] ${postId} → ${phase} (${detail})`);
    }
  }

  protected reversedLogs(): string[] {
    return [...this.logs()].reverse();
  }

  private pushLog(line: string): void {
    const stamp = new Date().toISOString().slice(11, 23);
    this.logs.update((entries) =>
      [...entries, `${stamp}  ${line}`].slice(-200),
    );
  }
}
