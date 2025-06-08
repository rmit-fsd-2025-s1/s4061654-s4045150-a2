// Custom Button
type buttonName = {
  name: string;
  func: any;
};
export default function Button({ name, func }: buttonName) {
  return <button onClick={func} style={{ color: '#000' }}>{name}</button>;
}
