import { Card, CardContent, Typography, Button } from '@mui/material';

export default function JobPostingList({ jobPosting }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{jobPosting.title}</Typography>
        <Typography color="text.secondary">{jobPosting.company} | {jobPosting.location}</Typography>
        <Typography sx={{ mt: 1 }}>연봉: {jobPosting.salary} | {jobPosting.skills}</Typography>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          href={jobPosting.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          자세히 보기
        </Button>
      </CardContent>
    </Card>
  );
}
