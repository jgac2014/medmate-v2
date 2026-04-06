export interface ExamCategory {
  key: string;
  label: string;
  icon: string;
}

export interface LabExam {
  id: string;
  name: string;
  category: string;
  description: string;
  instructions: string;
}

export interface SelectedExam {
  examId: string;
  name: string;
  notes: string;
}

export interface ExamRequest {
  exams: SelectedExam[];
  patientName: string;
  patientCpf: string;
  date: string;
  clinicalInfo: string;
}
