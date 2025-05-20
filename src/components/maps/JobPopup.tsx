
import React from 'react';
import { Job } from '@/types';
import { format } from 'date-fns';

interface JobPopupProps {
  job: Job;
  jobId: string;
}

export const JobPopup: React.FC<JobPopupProps> = ({ job, jobId }) => {
  // Format the date information based on scheduling type
  const getDateInfo = () => {
    if (job.schedulingType === "specific" && job.specificDate) {
      return format(new Date(job.specificDate), "MMM d, yyyy");
    } else if (job.schedulingType === "flexible" && job.weeklyPreference) {
      return job.weeklyPreference.join(', ');
    }
    return "Flexible";
  };

  // Format the location information
  const getLocationInfo = () => {
    if (job.address) {
      const { street, city, state, country } = job.address;
      const parts = [street, city, state, country].filter(Boolean);
      if (parts.length > 0) {
        return parts.join(', ');
      }
    }
    return "Remote";
  };

  // Create popup content DOM structure
  const createPopupElement = (): HTMLDivElement => {
    const popupContent = document.createElement('div');
    popupContent.className = 'p-2 max-w-xs';
    
    // Popup header (visible without clicking)
    const headerContent = document.createElement('div');
    headerContent.className = 'font-semibold text-primary cursor-pointer hover:underline';
    headerContent.textContent = job.title;
    headerContent.onclick = () => window.location.href = `/job/${job.id}`;
    
    const budgetContent = document.createElement('div');
    budgetContent.className = 'text-sm text-muted-foreground';
    budgetContent.textContent = `₱${job.budget}`;
    
    // Details content (expanded view)
    const detailsContent = document.createElement('div');
    detailsContent.className = 'mt-2 hidden';
    detailsContent.id = `details-${jobId}`;
    
    const description = document.createElement('p');
    description.className = 'text-sm mt-1 line-clamp-3';
    description.textContent = job.description;
    
    const location = document.createElement('div');
    location.className = 'text-xs text-muted-foreground mt-1';
    location.textContent = `📍 ${getLocationInfo()}`;
    
    const schedule = document.createElement('div');
    schedule.className = 'text-xs text-muted-foreground mt-1';
    schedule.textContent = `🕒 ${getDateInfo()}`;
    
    const skills = document.createElement('div');
    skills.className = 'text-xs mt-2 flex flex-wrap gap-1';
    job.skills.slice(0, 3).forEach(skill => {
      const skillTag = document.createElement('span');
      skillTag.className = 'bg-primary/10 text-primary px-1 rounded text-xs';
      skillTag.textContent = skill;
      skills.appendChild(skillTag);
    });
    
    const viewButton = document.createElement('a');
    viewButton.href = `/job/${job.id}`;
    viewButton.className = 'mt-2 bg-primary text-white text-xs px-3 py-1 rounded block text-center';
    viewButton.textContent = 'View Details';
    
    detailsContent.appendChild(description);
    detailsContent.appendChild(location);
    detailsContent.appendChild(schedule);
    detailsContent.appendChild(skills);
    detailsContent.appendChild(viewButton);
    
    // Toggle details on header click
    headerContent.addEventListener('click', (e) => {
      e.preventDefault();
      const details = document.getElementById(`details-${jobId}`);
      if (details) {
        details.classList.toggle('hidden');
      }
    });
    
    // Assemble popup
    popupContent.appendChild(headerContent);
    popupContent.appendChild(budgetContent);
    popupContent.appendChild(detailsContent);
    
    return popupContent;
  };

  return { createPopupElement };
};
