import { Component, OnDestroy } from '@angular/core';
import { NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SECTIONS, Section } from './mock-data';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [NgClass],
  templateUrl: './section.component.html',
  styleUrl: './section.component.scss',
})
export class SectionComponent implements OnDestroy {
  data: Section | null = null;
  private sub: Subscription;

  constructor(route: ActivatedRoute) {
    this.sub = route.paramMap.subscribe(p => {
      const slug = p.get('slug') ?? '';
      this.data = SECTIONS[slug] ?? null;
      window.scrollTo(0, 0);
    });
  }
  ngOnDestroy() { this.sub.unsubscribe(); }
}
